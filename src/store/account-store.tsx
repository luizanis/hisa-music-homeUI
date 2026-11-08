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
import type { LocalizedText } from "@/lib/catalog";

const PREFIX = "hisa.account.";
const COUPON = "HISA10";

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
    // Private mode or full storage: the wireframe still works in memory.
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
  name: string;
  email: string;
  isDemo: boolean;
};

type AccountContextValue = {
  user: AccountUser | null;
  isSignedIn: boolean;
  isAuthReady: boolean;
  isDemo: boolean;
  startDemo: () => void;
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
  placeSingleOrder: (item: CartItem, method: PaymentMethod) => MockOrder;
  lessonProgress: Record<string, string[]>;
  completionDates: Record<string, string>;
  toggleLesson: (courseId: string, lessonId: string) => void;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  completedCount: (course: MockCourse) => number;
};

const AccountContext = createContext<AccountContextValue | null>(null);

const itemKey = (item: Pick<CartItem, "slug" | "catalog">) =>
  `${item.catalog}:${item.slug}`;

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [demoOn, setDemoOn] = useState<boolean>(() => read("demo", true));
  const [authReady, setAuthReady] = useState(false);
  const [realUser, setRealUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [profile, setProfile] = useState<Profile>(() => ({
    ...demoProfile,
    ...read<Profile>("profile", demoProfile),
  }));
  const [cart, setCart] = useState<CartItem[]>(() => read<CartItem[]>("cart", []));
  const [localOrders, setLocalOrders] = useState<MockOrder[]>(() =>
    read<MockOrder[]>("orders", []),
  );
  const [coupon, setCoupon] = useState<string | null>(() =>
    read<string | null>("coupon", null),
  );
  const [lessonProgress, setLessonProgress] = useState<Record<string, string[]>>(
    () => ({
      ...initialLessonProgress,
      ...read<Record<string, string[]>>("progress", {}),
    }),
  );
  const [completionDates, setCompletionDates] = useState<
    Record<string, string>
  >(() => ({
    ...seedCompletionDates,
    ...read<Record<string, string>>("completions", {}),
  }));

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
        const complete =
          lessonIds.length > 0 && lessonIds.every((id) => done.has(id));

        if (complete && !next[course.slug]) {
          next[course.slug] = new Date().toISOString();
          changed = true;
        } else if (!complete && next[course.slug]) {
          delete next[course.slug];
          changed = true;
        }
      });

      if (!changed) return current;
      write("completions", next);
      return next;
    });
  }, [lessonProgress]);

  useEffect(() => {
    void supabase.auth
      .getSession()
      .then(({ data }) => {
        const user = data.session?.user;
        if (!user) return;
        setRealUser({
          name:
            (user.user_metadata?.full_name as string | undefined) ??
            user.email?.split("@")[0] ??
            profile.name,
          email: user.email ?? profile.email,
        });
      })
      .finally(() => setAuthReady(true));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user;
        setRealUser(
          user
            ? {
                name:
                  (user.user_metadata?.full_name as string | undefined) ??
                  user.email?.split("@")[0] ??
                  profile.name,
                email: user.email ?? profile.email,
              }
            : null,
        );
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, [profile.email, profile.name]);

  const user = useMemo<AccountUser | null>(() => {
    if (realUser) return { ...realUser, isDemo: false };
    if (demoOn)
      return { name: profile.name, email: profile.email, isDemo: true };
    return null;
  }, [demoOn, profile.email, profile.name, realUser]);

  const startDemo = useCallback(() => {
    setDemoOn(true);
    write("demo", true);
  }, []);

  const signOut = useCallback(async () => {
    if (realUser) await supabase.auth.signOut();
    setDemoOn(false);
    write("demo", false);
  }, [realUser]);

  const updateProfile = useCallback(
    (patch: Partial<Omit<Profile, "country">>) => {
      setProfile((current) => {
        const next = { ...current, ...patch };
        write("profile", next);
        return next;
      });
    },
    [],
  );

  const addToCart = useCallback((item: CartItem) => {
    let added = false;
    setCart((current) => {
      if (current.some((entry) => itemKey(entry) === itemKey(item))) {
        return current;
      }
      added = true;
      const next = [...current, item];
      write("cart", next);
      return next;
    });
    return added;
  }, []);

  const removeFromCart = useCallback(
    (slug: string, catalog: CartItem["catalog"]) => {
      setCart((current) => {
        const next = current.filter(
          (entry) => !(entry.slug === slug && entry.catalog === catalog),
        );
        write("cart", next);
        return next;
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    write("cart", []);
  }, []);

  const subtotalCents = useMemo(
    () => cart.reduce((total, item) => total + item.price_cents, 0),
    [cart],
  );

  const discountCents = useMemo(
    () => (coupon === COUPON ? Math.round(subtotalCents * 0.1) : 0),
    [coupon, subtotalCents],
  );

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized !== COUPON) return false;
    setCoupon(normalized);
    write("coupon", normalized);
    return true;
  }, []);

  const clearCoupon = useCallback(() => {
    setCoupon(null);
    write("coupon", null);
  }, []);

  const orders = useMemo(
    () =>
      [...localOrders, ...seedOrders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [localOrders],
  );

  const placeOrder = useCallback(
    (method: PaymentMethod) => {
      if (cart.length === 0) return null;

      const items: MockOrderItem[] = cart.map((item) => ({ ...item }));
      const discount = coupon === COUPON ? Math.round(subtotalCents * 0.1) : 0;
      const order: MockOrder = {
        id: `HISA-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000,
        )}`,
        createdAt: new Date().toISOString(),
        method,
        status: method === "credit" ? "paid" : "pending",
        discount_cents: discount,
        items,
      };

      setLocalOrders((current) => {
        const next = [order, ...current];
        write("orders", next);
        return next;
      });
      setCart([]);
      write("cart", []);
      setCoupon(null);
      write("coupon", null);

      return order;
    },
    [cart, coupon, subtotalCents],
  );

  const placeSingleOrder = useCallback(
    (item: CartItem, method: PaymentMethod) => {
      const order: MockOrder = {
        id: `HISA-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000,
        )}`,
        createdAt: new Date().toISOString(),
        method,
        status: method === "credit" ? "paid" : "pending",
        discount_cents: 0,
        items: [{ ...item }],
      };

      setLocalOrders((current) => {
        const next = [order, ...current];
        write("orders", next);
        return next;
      });

      return order;
    },
    [],
  );

  const toggleLesson = useCallback((courseId: string, lessonId: string) => {
    setLessonProgress((current) => {
      const done = current[courseId] ?? [];
      const next = {
        ...current,
        [courseId]: done.includes(lessonId)
          ? done.filter((id) => id !== lessonId)
          : [...done, lessonId],
      };
      write("progress", next);
      return next;
    });
  }, []);

  const isLessonCompleted = useCallback(
    (courseId: string, lessonId: string) =>
      (lessonProgress[courseId] ?? []).includes(lessonId),
    [lessonProgress],
  );

  const completedCount = useCallback(
    (course: MockCourse) => {
      const done = lessonProgress[course.slug] ?? [];
      const ids = course.modules.flatMap((module) =>
        module.lessons.map((lesson) => lesson.id),
      );
      return ids.filter((id) => done.includes(id)).length;
    },
    [lessonProgress],
  );

  const value: AccountContextValue = {
    user,
    isSignedIn: Boolean(user),
    isAuthReady: authReady,
    isDemo: Boolean(user?.isDemo),
    startDemo,
    signOut,
    profile,
    updateProfile,
    cart,
    cartCount: cart.length,
    addToCart,
    removeFromCart,
    clearCart,
    subtotalCents,
    discountCents,
    totalCents: subtotalCents - discountCents,
    coupon,
    applyCoupon,
    clearCoupon,
    orders,
    placeOrder,
    placeSingleOrder,
    lessonProgress,
    completionDates,
    toggleLesson,
    isLessonCompleted,
    completedCount,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used inside AccountProvider");
  }
  return context;
};


