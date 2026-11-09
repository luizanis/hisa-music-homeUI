import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  courses,
  demoProfile,
  initialLessonProgress,
  seedCompletionDates,
  seedOrders,
  type MockCourse,
  type MockOrder,
  type MockOrderItem,
} from "@/data/account";
import { supabase } from "@/integrations/supabase/client";
import { cartTotals, type ProductSnapshot } from "@/lib/cart";
import type { LocalizedText } from "@/lib/catalog";
import { cartActions, profileStore, useCart } from "@/lib/member-store";

/**
 * Student-area state for the pages imported from Enter.
 *
 * - Signed-in state comes only from the real auth session (no demo sign-in).
 * - The cart is the one shared Lovable cart (header drawer, product pages,
 *   cart page and checkout all read and write the same store).
 * - Orders, course progress and certificates are still kept in this browser,
 *   per signed-in user, until the payment and course backends exist.
 */

const PREFIX = "hisa.account.";

const read = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Private mode or full storage: the page still works in memory.
  }
};

export type CartItem = {
  slug: string;
  catalog: "academy" | "sounds";
  category: string;
  title: LocalizedText;
  price_cents: number;
  variant: number;
};

export type PaymentMethod = "credit" | "pix";
export type OrderStatus = MockOrder["status"];

export type Profile = Omit<typeof demoProfile, "country"> & {
  country: LocalizedText;
};

export type AccountUser = {
  id: string;
  name: string;
  email: string;
  /** Demo sign-in is disabled; kept for the imported pages' type contract. */
  isDemo: false;
};

type AccountContextValue = {
  user: AccountUser | null;
  isSignedIn: boolean;
  isAuthReady: boolean;
  /** Always false: visitors are never treated as signed in without a session. */
  isDemo: false;
  signOut: () => Promise<void>;
  profile: Profile;
  updateProfile: (patch: Partial<Omit<Profile, "country">>) => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => boolean;
  removeFromCart: (slug: string, catalog: CartItem["catalog"]) => void;
  clearCart: () => void;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;
  orders: MockOrder[];
  placeOrder: (method: PaymentMethod) => MockOrder | null;
  lessonProgress: Record<string, string[]>;
  completionDates: Record<string, string>;
  toggleLesson: (courseId: string, lessonId: string) => void;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  completedCount: (course: MockCourse) => number;
};

const AccountContext = createContext<AccountContextValue | null>(null);

/** Stable artwork variant per product, so covers don't change between visits. */
const variantFor = (slug: string) =>
  [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;

export const toCartItem = (item: ProductSnapshot): CartItem => ({
  slug: item.slug,
  catalog: item.catalog === "sounds" ? "sounds" : "academy",
  category: item.category,
  title: { pt: item.title_pt, en: item.title_en },
  price_cents: item.price_cents,
  variant: variantFor(item.slug),
});

export const toSnapshot = (item: CartItem): ProductSnapshot => ({
  slug: item.slug,
  catalog: item.catalog,
  category: item.category,
  title_pt: item.title.pt,
  title_en: item.title.en,
  price_cents: item.price_cents,
});

const metaString = (user: User, key: string) => {
  const value = (user.user_metadata as Record<string, unknown> | undefined)?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
};

const accountUserOf = (user: User): AccountUser => ({
  id: user.id,
  name:
    metaString(user, "full_name") ??
    metaString(user, "name") ??
    (user.email ?? "").split("@")[0] ??
    "HISA",
  email: user.email ?? "",
  isDemo: false,
});

/** Profile defaults for a real account; details the user has not filled stay empty. */
const baseProfileFor = (user: User, account: AccountUser): Profile => ({
  name: account.name,
  email: account.email,
  phone: "",
  city: "",
  country: demoProfile.country,
  birthdate: "",
  memberSince: user.created_at,
  lastLogin: user.last_sign_in_at ?? user.created_at,
  userId: `HISA-USR-${user.id.slice(0, 8).toUpperCase()}`,
  plan: demoProfile.plan,
  avatarUrl: null,
});

const newOrderId = () =>
  `HISA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [storedProfile, setStoredProfile] = useState<Partial<Profile>>({});
  const [localOrders, setLocalOrders] = useState<MockOrder[]>([]);
  const [lessonProgress, setLessonProgress] =
    useState<Record<string, string[]>>(initialLessonProgress);
  const [completionDates, setCompletionDates] =
    useState<Record<string, string>>(seedCompletionDates);

  const sharedCart = useCart();

  useEffect(() => {
    let active = true;
    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setAuthUser(data.session?.user ?? null);
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAuthUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const userId = authUser?.id ?? null;
  const user = useMemo(() => (authUser ? accountUserOf(authUser) : null), [authUser]);

  // Each signed-in account keeps its own profile edits, orders and progress
  // in this browser. Read after hydration so server and client agree.
  useEffect(() => {
    if (!userId) {
      setStoredProfile({});
      setLocalOrders([]);
      setLessonProgress(initialLessonProgress);
      setCompletionDates(seedCompletionDates);
      return;
    }
    setStoredProfile(read<Partial<Profile>>(`profile:${userId}`, {}));
    setLocalOrders(read<MockOrder[]>(`orders:${userId}`, []));
    setLessonProgress({
      ...initialLessonProgress,
      ...read<Record<string, string[]>>(`progress:${userId}`, {}),
    });
    setCompletionDates({
      ...seedCompletionDates,
      ...read<Record<string, string>>(`completions:${userId}`, {}),
    });
  }, [userId]);

  const profile = useMemo<Profile>(() => {
    if (!authUser || !user) return demoProfile as Profile;
    return { ...baseProfileFor(authUser, user), ...storedProfile } as Profile;
  }, [authUser, storedProfile, user]);

  // Keep certificate eligibility and its completion date in sync with progress.
  useEffect(() => {
    setCompletionDates((current) => {
      let changed = false;
      const next = { ...current };

      courses.forEach((course) => {
        const done = new Set(lessonProgress[course.slug] ?? []);
        const lessonIds = course.modules.flatMap((module) =>
          module.lessons.map((lesson) => lesson.id),
        );
        const complete = lessonIds.length > 0 && lessonIds.every((id) => done.has(id));

        if (complete && !next[course.slug]) {
          next[course.slug] = new Date().toISOString();
          changed = true;
        } else if (!complete && next[course.slug]) {
          delete next[course.slug];
          changed = true;
        }
      });

      if (!changed) return current;
      if (userId) write(`completions:${userId}`, next);
      return next;
    });
  }, [lessonProgress, userId]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Omit<Profile, "country">>) => {
      if (!userId) return;
      setStoredProfile((current) => {
        const next = { ...current, ...patch };
        write(`profile:${userId}`, next);
        return next;
      });
      // The header's account icon shows the same name and photo.
      if ("name" in patch || "avatarUrl" in patch) {
        profileStore.set((current) => ({
          name: patch.name ?? current.name,
          avatar: "avatarUrl" in patch ? (patch.avatarUrl ?? null) : current.avatar,
        }));
      }
    },
    [userId],
  );

  const cart = useMemo(() => sharedCart.items.map(toCartItem), [sharedCart.items]);
  const totals = useMemo(
    () => cartTotals(sharedCart.items, sharedCart.coupon),
    [sharedCart.coupon, sharedCart.items],
  );

  const addToCart = useCallback(
    (item: CartItem) => {
      if (sharedCart.items.some((entry) => entry.slug === item.slug)) return false;
      cartActions.add(toSnapshot(item));
      return true;
    },
    [sharedCart.items],
  );

  const removeFromCart = useCallback((slug: string) => {
    cartActions.remove(slug);
  }, []);

  const orders = useMemo(
    () =>
      [...localOrders, ...(userId ? seedOrders : [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [localOrders, userId],
  );

  /**
   * Registers the cart as an order awaiting payment. No payment provider is
   * connected yet, so nothing is charged and the order stays pending.
   */
  const placeOrder = useCallback(
    (method: PaymentMethod) => {
      if (!userId || sharedCart.items.length === 0) return null;

      const items: MockOrderItem[] = sharedCart.items.map(toCartItem);
      const order: MockOrder = {
        id: newOrderId(),
        createdAt: new Date().toISOString(),
        method,
        status: "pending",
        discount_cents: totals.discount_cents,
        items,
      };

      setLocalOrders((current) => {
        const next = [order, ...current];
        write(`orders:${userId}`, next);
        return next;
      });
      cartActions.clear();

      return order;
    },
    [sharedCart.items, totals.discount_cents, userId],
  );

  const toggleLesson = useCallback(
    (courseId: string, lessonId: string) => {
      setLessonProgress((current) => {
        const done = current[courseId] ?? [];
        const next = {
          ...current,
          [courseId]: done.includes(lessonId)
            ? done.filter((id) => id !== lessonId)
            : [...done, lessonId],
        };
        if (userId) write(`progress:${userId}`, next);
        return next;
      });
    },
    [userId],
  );

  const isLessonCompleted = useCallback(
    (courseId: string, lessonId: string) =>
      (lessonProgress[courseId] ?? []).includes(lessonId),
    [lessonProgress],
  );

  const completedCount = useCallback(
    (course: MockCourse) => {
      const done = lessonProgress[course.slug] ?? [];
      const ids = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
      return ids.filter((id) => done.includes(id)).length;
    },
    [lessonProgress],
  );

  const value: AccountContextValue = {
    user,
    isSignedIn: Boolean(user),
    isAuthReady: authReady,
    isDemo: false,
    signOut,
    profile,
    updateProfile,
    cart,
    cartCount: cart.length,
    addToCart,
    removeFromCart,
    clearCart: cartActions.clear,
    subtotalCents: totals.subtotal_cents,
    discountCents: totals.discount_cents,
    totalCents: totals.total_cents,
    coupon: sharedCart.coupon,
    applyCoupon: cartActions.applyCoupon,
    clearCoupon: cartActions.clearCoupon,
    orders,
    placeOrder,
    lessonProgress,
    completionDates,
    toggleLesson,
    isLessonCompleted,
    completedCount,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used inside AccountProvider");
  }
  return context;
};
