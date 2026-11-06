import type { CatalogKey, CatalogProduct } from "@/lib/catalog";

/** What the cart, orders and library keep about a product. */
export type ProductSnapshot = {
  slug: string;
  catalog: CatalogKey;
  category: string;
  title_pt: string;
  title_en: string;
  price_cents: number;
};

export type CartState = {
  items: ProductSnapshot[];
  coupon: string | null;
};

export const emptyCart: CartState = { items: [], coupon: null };

export const toSnapshot = (product: CatalogProduct): ProductSnapshot => ({
  slug: product.slug,
  catalog: product.catalog === "sounds" ? "sounds" : "academy",
  category: product.category,
  title_pt: product.title_pt,
  title_en: product.title_en,
  price_cents: product.price_cents,
});

export const snapshotTitle = (item: ProductSnapshot, locale: string) =>
  locale === "en" ? item.title_en : item.title_pt;

/** Short packaging code shown on covers and thumbnails: AC-COU, SP-DRU… */
export const productCode = (catalog: CatalogKey, category: string) =>
  `${catalog === "academy" ? "AC" : "SP"}-${category.slice(0, 3).toUpperCase()}`;

/**
 * Courses and digital products are single-licence: adding the same product
 * again keeps one entry instead of raising a quantity.
 */
export const addToCart = (cart: CartState, item: ProductSnapshot): CartState =>
  cart.items.some((existing) => existing.slug === item.slug)
    ? cart
    : { ...cart, items: [...cart.items, item] };

export const removeFromCart = (cart: CartState, slug: string): CartState => {
  const items = cart.items.filter((item) => item.slug !== slug);
  return { items, coupon: items.length > 0 ? cart.coupon : null };
};

/** Phase 01 mock coupons. Real promotions arrive with the payment backend. */
export const COUPONS: Record<string, number> = {
  HISA10: 10,
};

export const normalizeCoupon = (code: string) => code.trim().toUpperCase();

export const isValidCoupon = (code: string) => normalizeCoupon(code) in COUPONS;

export type CartTotals = {
  subtotal_cents: number;
  discount_cents: number;
  total_cents: number;
};

export const cartTotals = (items: ProductSnapshot[], coupon: string | null): CartTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.price_cents, 0);
  const percent = coupon ? (COUPONS[normalizeCoupon(coupon)] ?? 0) : 0;
  const discount = Math.round((subtotal * percent) / 100);
  return { subtotal_cents: subtotal, discount_cents: discount, total_cents: subtotal - discount };
};

export type OrderStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentMethod = "credit" | "pix";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  method: PaymentMethod;
  items: ProductSnapshot[];
  coupon: string | null;
} & CartTotals;

/** Only a paid order unlocks its courses and downloads. */
export const grantsAccess = (status: OrderStatus) => status === "paid";

/** Every product the user can open, newest purchase first, without repeats. */
export const ownedProducts = (orders: Order[]) => {
  const seen = new Map<string, { item: ProductSnapshot; purchasedAt: string; orderId: string }>();
  [...orders]
    .filter((order) => grantsAccess(order.status))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .forEach((order) => {
      order.items.forEach((item) => {
        if (!seen.has(item.slug)) {
          seen.set(item.slug, { item, purchasedAt: order.createdAt, orderId: order.id });
        }
      });
    });
  return [...seen.values()];
};
