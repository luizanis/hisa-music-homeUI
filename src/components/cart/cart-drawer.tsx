import { ShoppingCart, Trash2 } from "lucide-react";
import { createContext, useContext, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState, ProductThumb, SummaryRow } from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useLocale } from "@/i18n/routing";
import { cartTotals, snapshotTitle, type ProductSnapshot } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { cartActions, useCart } from "@/lib/member-store";

type CartDrawerContextValue = { open: () => void; close: () => void };

const CartDrawerContext = createContext<CartDrawerContextValue>({
  open: () => undefined,
  close: () => undefined,
});

export const useCartDrawer = () => useContext(CartDrawerContext);

/** Provides the one cart drawer shared by every page in a locale. */
export const CartDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({ open: () => setIsOpen(true), close: () => setIsOpen(false) }),
    [],
  );

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 border-l border-wire-rule p-0 shadow-none sm:max-w-md"
        >
          <CartPanel onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </CartDrawerContext.Provider>
  );
};

export const CartLine = ({
  item,
  onRemove,
}: {
  item: ProductSnapshot;
  onRemove?: (() => void) | undefined;
}) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const title = snapshotTitle(item, locale);

  return (
    <li className="flex gap-3 border-b border-wire-rule py-4 last:border-b-0">
      <ProductThumb catalog={item.catalog} category={item.category} />
      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
          {t(`catalog.${item.catalog}.label`)} · {t(`catalog.${item.catalog}.filters.${item.category}`)}
        </p>
        <p className="mt-1 text-[12px] uppercase leading-snug tracking-[0.04em] text-foreground">
          {title}
        </p>
        <p className="mt-1 text-[10px] text-wire-ink-soft">{t("cart.singleLicence")}</p>
      </div>
      <div className="flex flex-col items-end justify-between gap-2">
        <span className="font-mono text-[12px] text-foreground">{formatPrice(item.price_cents)}</span>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`${t("cart.remove")}: ${title}`}
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 hover:text-foreground"
          >
            <Trash2 aria-hidden className="h-3 w-3" strokeWidth={1.5} />
            {t("cart.remove")}
          </button>
        ) : null}
      </div>
    </li>
  );
};

/** Coupon entry shared by the drawer and the checkout. Mock codes only. */
export const CouponField = () => {
  const { t } = useTranslation();
  const cart = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (cart.coupon) {
    return (
      <div className="flex items-center justify-between gap-3 border border-wire-ink bg-wire-surface px-3 py-2">
        <span className="text-[10px] uppercase tracking-[0.14em] text-foreground">
          {t("cart.couponApplied", { code: cart.coupon })}
        </span>
        <button
          type="button"
          onClick={cartActions.clearCoupon}
          className="text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 hover:text-foreground"
        >
          {t("cart.remove")}
        </button>
      </div>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const ok = cartActions.applyCoupon(code);
    setError(!ok);
    if (ok) setCode("");
  };

  return (
    <form onSubmit={submit} className="space-y-1.5">
      <label htmlFor="cart-coupon" className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
        {t("cart.coupon")}
      </label>
      <div className="flex gap-2">
        <Input
          id="cart-coupon"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError(false);
          }}
          aria-invalid={error}
          aria-describedby="cart-coupon-hint"
          className="h-10 rounded-[var(--radius)] border-wire-rule bg-background text-[12px] uppercase focus-visible:ring-1 focus-visible:ring-offset-0"
        />
        <Button type="submit" variant="outline" disabled={!code.trim()}>
          {t("cart.apply")}
        </Button>
      </div>
      <p
        id="cart-coupon-hint"
        role={error ? "alert" : undefined}
        className={error ? "text-[10px] text-destructive" : "text-[10px] text-wire-ink-soft"}
      >
        {error ? t("cart.couponInvalid") : t("cart.couponHint")}
      </p>
    </form>
  );
};

const CartPanel = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const cart = useCart();
  const totals = cartTotals(cart.items, cart.coupon);
  const isEmpty = cart.items.length === 0;

  return (
    <>
      <div className="border-b border-wire-rule px-5 py-4 pr-12">
        <SheetTitle className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.12em] text-foreground">
          <ShoppingCart aria-hidden className="h-4 w-4" strokeWidth={1.5} />
          {t("cart.title")}
          <span className="font-mono text-[11px] text-wire-ink-soft">({cart.items.length})</span>
        </SheetTitle>
        <SheetDescription className="mt-1 text-[11px] text-wire-ink-soft">
          {t("cart.lead")}
        </SheetDescription>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {isEmpty ? (
          <div className="py-6">
            <EmptyState title={t("cart.emptyTitle")} text={t("cart.emptyText")}>
              <Button asChild size="sm">
                <Link to={to("academy")} onClick={onClose}>
                  {t("nav.academy")}
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={to("sounds")} onClick={onClose}>
                  {t("nav.sounds")}
                </Link>
              </Button>
            </EmptyState>
          </div>
        ) : (
          <ul aria-label={t("cart.title")}>
            {cart.items.map((item) => (
              <CartLine key={item.slug} item={item} onRemove={() => cartActions.remove(item.slug)} />
            ))}
          </ul>
        )}
      </div>

      {!isEmpty ? (
        <div className="space-y-4 border-t border-wire-rule px-5 py-4">
          <CouponField />
          <div className="border-t border-wire-rule pt-2">
            <SummaryRow label={t("cart.subtotal")} value={formatPrice(totals.subtotal_cents)} />
            {totals.discount_cents > 0 ? (
              <SummaryRow label={t("cart.discount")} value={`− ${formatPrice(totals.discount_cents)}`} />
            ) : null}
            <SummaryRow label={t("checkout.total")} value={formatPrice(totals.total_cents)} strong />
          </div>
          <div className="grid gap-2">
            <Button asChild size="lg">
              <Link to={to("checkout")} onClick={onClose}>
                {t("cart.checkout")}
              </Link>
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t("cart.continue")}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};
