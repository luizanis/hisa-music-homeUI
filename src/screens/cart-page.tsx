import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/i18n/routing";
import { formatPrice, pickLocale } from "@/lib/catalog";

import { useAccount } from "@/store/account-store";

const CartPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const {
    cart,
    cartCount,
    removeFromCart,
    subtotalCents,
    discountCents,
    totalCents,
    coupon,
    applyCoupon,
    clearCoupon,
  } = useAccount();
  const key = pickLocale(locale);

  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<"applied" | "error" | null>(
    coupon ? "applied" : null,
  );

  const submitCoupon = (event: FormEvent) => {
    event.preventDefault();
    setFeedback(applyCoupon(code) ? "applied" : "error");
  };

  return (
    <>
      <PageHeader
        label={t("cart.label")}
        title={t("cart.title")}
        description={t("cart.lead")}
        actions={
          <span className="border border-wire-rule px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
            {t("cart.itemCount", { count: cartCount })}
          </span>
        }
      />

      {cart.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ShoppingBag}
            title={t("cart.empty.title")}
            text={t("cart.empty.text")}
          >
            <Button asChild>
              <Link to={to("academy")}>{t("cart.empty.academy")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={to("sounds")}>{t("cart.empty.sounds")}</Link>
            </Button>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <ul className="flex flex-col gap-3">
            {cart.map((item) => (
              <li
                key={`${item.catalog}-${item.slug}`}
                className="flex gap-3 border border-wire-rule bg-background p-3 sm:gap-4"
              >
                <Link
                  to={`${to("product")}/${item.slug}`}
                  aria-label={item.title[key]}
                  className="block w-[84px] shrink-0 sm:w-[104px]"
                >
                  <span className="relative flex aspect-[4/3] w-full items-end overflow-hidden border border-media-line/20 bg-media p-2 text-media-foreground">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-1 -top-3 select-none font-medium leading-none text-media-foreground/10 text-[2.2rem]"
                    >
                      {item.catalog === "academy" ? "AC" : "SP"}
                    </span>
                    <span className="relative text-[7px] uppercase leading-tight tracking-[0.14em] text-media-soft">
                      {t(`catalog.${item.catalog}.filters.${item.category}`)}
                    </span>
                  </span>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                    {t(`catalog.${item.catalog}.label`)} ·{" "}
                    {t(`catalog.${item.catalog}.filters.${item.category}`)}
                  </p>
                  <h2 className="mt-1.5 text-[12px] font-medium uppercase leading-snug tracking-[0.04em] text-foreground">
                    <Link
                      to={`${to("product")}/${item.slug}`}
                      className="hover:underline hover:underline-offset-4"
                    >
                      {item.title[key]}
                    </Link>
                  </h2>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <span className="font-mono text-[13px] text-foreground">
                      {formatPrice(item.price_cents)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.slug, item.catalog)}
                      className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-destructive"
                    >
                      <X aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}

            <li>
              <Link
                to={to("academy")}
                className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
              >
                {t("cart.continue")}
                <ArrowRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            </li>
          </ul>

          <div className="lg:sticky lg:top-[88px]">
            <Panel label={t("cart.summary")} bodyClassName="p-0">
              <div className="border-b border-wire-rule p-4">
                <form onSubmit={submitCoupon} className="flex gap-2">
                  <label htmlFor="cart-coupon" className="sr-only">
                    {t("cart.coupon")}
                  </label>
                  <Input
                    id="cart-coupon"
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value);
                      setFeedback(null);
                    }}
                    placeholder={t("cart.couponPlaceholder")}
                    autoComplete="off"
                    className="h-9 border-wire-rule bg-background text-[11px] uppercase"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    {t("cart.apply")}
                  </Button>
                </form>

                {feedback === "applied" ? (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[9px] uppercase tracking-[0.12em] text-foreground">
                      {coupon} · {t("cart.couponApplied")}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        clearCoupon();
                        setFeedback(null);
                        setCode("");
                      }}
                      className="text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft hover:text-foreground"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                ) : null}
                {feedback === "error" ? (
                  <p role="alert" className="mt-2 text-[10px] text-destructive">
                    {t("cart.couponError")}
                  </p>
                ) : null}
              </div>

              <dl className="space-y-2 p-4 text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-wire-ink-soft">{t("cart.subtotal")}</dt>
                  <dd className="font-mono text-foreground">
                    {formatPrice(subtotalCents)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-wire-ink-soft">{t("cart.discount")}</dt>
                  <dd className="font-mono text-foreground">
                    {discountCents > 0
                      ? `- ${formatPrice(discountCents)}`
                      : formatPrice(0)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-wire-rule pt-2">
                  <dt className="uppercase tracking-[0.12em] text-foreground">
                    {t("cart.total")}
                  </dt>
                  <dd className="font-mono text-[14px] text-foreground">
                    {formatPrice(totalCents)}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-wire-rule p-4">
                <Button asChild size="lg" className="w-full">
                  <Link to={to("checkout")}>
                    {t("cart.checkout")}
                    <ArrowRight aria-hidden strokeWidth={1.5} />
                  </Link>
                </Button>
                <p className="mt-3 text-[9px] leading-relaxed text-wire-ink-soft">
                  {t("cart.note")}
                </p>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
