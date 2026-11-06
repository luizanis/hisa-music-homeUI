import { useMemo } from "react";

import {
  curriculumFor,
  lessonsOf,
  seedOrders,
  seedProgress,
  type CourseProgress,
  type Curriculum,
} from "@/data/member-mock";
import {
  addToCart,
  cartTotals,
  emptyCart,
  isValidCoupon,
  normalizeCoupon,
  ownedProducts,
  removeFromCart,
  type CartState,
  type Order,
  type OrderStatus,
  type PaymentMethod,
  type ProductSnapshot,
} from "@/lib/cart";
import { hasInstantAccess } from "@/lib/catalog";
import { createLocalStore, useLocalStore } from "@/lib/local-store";

/* ------------------------------------------------------------------- cart */

export const cartStore = createLocalStore<CartState>("hisa:cart", emptyCart);

export const useCart = () => useLocalStore(cartStore);

export const cartActions = {
  add: (item: ProductSnapshot) => cartStore.set((cart) => addToCart(cart, item)),
  remove: (slug: string) => cartStore.set((cart) => removeFromCart(cart, slug)),
  removeMany: (slugs: string[]) =>
    cartStore.set((cart) => slugs.reduce((next, slug) => removeFromCart(next, slug), cart)),
  applyCoupon: (code: string) => {
    if (!isValidCoupon(code)) return false;
    cartStore.set((cart) => ({ ...cart, coupon: normalizeCoupon(code) }));
    return true;
  },
  clearCoupon: () => cartStore.set((cart) => ({ ...cart, coupon: null })),
  clear: () => cartStore.set(emptyCart),
};

/* ------------------------------------------------------- demo account data */

export type DemoMode = "demo" | "empty";

const demoStore = createLocalStore<DemoMode>("hisa:demo-mode", "demo");
const placedOrdersStore = createLocalStore<Order[]>("hisa:orders", []);
const progressStore = createLocalStore<Record<string, CourseProgress>>("hisa:progress", {});

export const useDemoMode = () => useLocalStore(demoStore);

export const demoActions = {
  reset: () => {
    placedOrdersStore.set([]);
    progressStore.set({});
    demoStore.set("demo");
  },
  empty: () => {
    placedOrdersStore.set([]);
    progressStore.set({});
    demoStore.set("empty");
  },
};

export const useOrders = (): Order[] => {
  const mode = useLocalStore(demoStore);
  const placed = useLocalStore(placedOrdersStore);
  return useMemo(
    () =>
      [...(mode === "demo" ? seedOrders : []), ...placed].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [mode, placed],
  );
};

const newOrderId = () => `HISA-${Math.floor(30000 + Math.random() * 69999)}`;

/** Simulated purchase. A real order is confirmed only by the payment webhook. */
export const placeOrder = (input: {
  items: ProductSnapshot[];
  coupon: string | null;
  method: PaymentMethod;
  status: OrderStatus;
}): Order => {
  const order: Order = {
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    status: input.status,
    method: input.method,
    items: input.items,
    coupon: input.coupon,
    ...cartTotals(input.items, input.coupon),
  };
  placedOrdersStore.set((orders) => [...orders, order]);
  return order;
};

/* --------------------------------------------------------------- progress */

export const useProgressMap = (): Record<string, CourseProgress> => {
  const mode = useLocalStore(demoStore);
  const stored = useLocalStore(progressStore);
  return useMemo(
    () => (mode === "demo" ? { ...seedProgress, ...stored } : stored),
    [mode, stored],
  );
};

const emptyProgress: CourseProgress = { completed: [], lastLesson: null, lastAccessed: null };

const writeProgress = (
  slug: string,
  current: CourseProgress | undefined,
  update: (progress: CourseProgress) => CourseProgress,
) => progressStore.set((map) => ({ ...map, [slug]: update(current ?? emptyProgress) }));

export const progressActions = {
  open: (slug: string, current: CourseProgress | undefined, lessonId: string) =>
    writeProgress(slug, current, (progress) => ({
      ...progress,
      lastLesson: lessonId,
      lastAccessed: new Date().toISOString(),
    })),
  toggleComplete: (slug: string, current: CourseProgress | undefined, lessonId: string) =>
    writeProgress(slug, current, (progress) => ({
      ...progress,
      completed: progress.completed.includes(lessonId)
        ? progress.completed.filter((id) => id !== lessonId)
        : [...progress.completed, lessonId],
    })),
};

export type CourseStatus = "inProgress" | "completed" | "notStarted";

export const summarizeProgress = (course: Curriculum, progress: CourseProgress | undefined) => {
  const lessons = lessonsOf(course);
  const total = lessons.length;
  const done = lessons.filter((lesson) => progress?.completed.includes(lesson.id)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const status: CourseStatus =
    done === total && total > 0
      ? "completed"
      : done > 0 || progress?.lastAccessed
        ? "inProgress"
        : "notStarted";
  const nextLesson =
    lessons.find((lesson) => lesson.id === progress?.lastLesson && !progress?.completed.includes(lesson.id)) ??
    lessons.find((lesson) => !progress?.completed.includes(lesson.id)) ??
    lessons[0];
  return { total, done, percent, status, nextLesson };
};

/* --------------------------------------------------- what the user can open */

export const useLibrary = () => {
  const orders = useOrders();
  const progress = useProgressMap();

  return useMemo(() => {
    const owned = ownedProducts(orders);
    const courses = owned
      .filter(({ item }) => item.catalog === "academy" && hasInstantAccess(item.category))
      .flatMap((entry) => {
        const curriculum = curriculumFor(entry.item.slug);
        if (!curriculum) return [];
        const courseProgress = progress[entry.item.slug];
        return [
          {
            ...entry,
            curriculum,
            progress: courseProgress,
            summary: summarizeProgress(curriculum, courseProgress),
          },
        ];
      });
    const downloads = owned.filter(({ item }) => item.catalog === "sounds");
    return { orders, owned, courses, downloads };
  }, [orders, progress]);
};

/* ------------------------------------------------------ profile and prefs */

export type Profile = { name: string | null; avatar: string | null };

export const profileStore = createLocalStore<Profile>("hisa:profile", { name: null, avatar: null });

export const useProfile = () => useLocalStore(profileStore);

export type NotificationPrefs = {
  orders: boolean;
  courses: boolean;
  releases: boolean;
  newsletter: boolean;
};

export const notificationStore = createLocalStore<NotificationPrefs>("hisa:notifications", {
  orders: true,
  courses: true,
  releases: false,
  newsletter: false,
});

export const useNotificationPrefs = () => useLocalStore(notificationStore);
