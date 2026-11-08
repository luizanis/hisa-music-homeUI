import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@/lib/router-compat";

import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Section } from "@/components/site/section";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";
import { formatPrice, pickLocale } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useAccount, type PaymentMethod } from "@/store/account-store";

const methods: PaymentMethod[] = ["credit", "pix"];

const CartCheckoutPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const key = pickLocale(locale);
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    subtotalCents,
    discountCents,
    totalCents,
    coupon,
    placeOrder,
    isSignedIn,
    isAuthReady,
    user,
    profile,
    signOut,
    isDemo,
  } = useAccount();

  const [method, setMethod] = useState<PaymentMethod>("credit");

  const signinHref = `${to("signin")}?next=${encodeURIComponent(
    to("checkout"),
  )}`;

  useEffect(() => {
    if (isAuthReady && !isSignedIn) navigate(signinHref, { replace: true });
  }, [isAuthReady, isSignedIn, navigate, signinHref]);

  const handleSignOut = async () => {
    await signOut();
    navigate(signinHref, { replace: true });
  };

  const confirm = () => {
    const order = placeOrder(method);
    if (order) navigate(`${to("order-confirmation")}/${order.id}`);
  };

  return (
    <Section innerClassName="py-10 md:py-14">
      <PageHeader
        label={t("checkout.label")}
        title={t("checkout.cartTitle")}
        description={t("checkout.cartLead")}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to={to("cart")}>
              <ArrowLeft aria-hidden strokeWidth={1.5} />
              {t("checkout.backToCart")}
            </Link>
          </Button>
        }
      />

      {cart.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Lock}
            title={t("checkout.empty.title")}
            text={t("checkout.empty.text")}
          >
            <Button asChild>
              <Link to={to("cart")}>{t("checkout.backToCart")}</Link>
            </Button>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="flex flex-col gap-5">
            <Panel label={t("checkout.account")}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                    {t("checkout.signedAs")}
                  </p>
                  <p className="mt-1 truncate text-[12px] text-foreground">
                    {user?.email ?? profile.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 hover:text-foreground"
                >
                  {t("checkout.logout")}
                </button>
              </div>
              {isDemo ? (
                <p className="mt-3 border-t border-wire-rule pt-3 text-[10px] leading-relaxed text-wire-ink-soft">
                  {t("checkout.demoNotice")}
                </p>
              ) : null}
            </Panel>

            <Panel label={t("checkout.items")} bodyClassName="p-0">
              <ul>
                {cart.map((item) => (
                  <li
                    key={`${item.catalog}-${item.slug}`}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-wire-rule px-4 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.06em] text-foreground">
                        {item.title[key]}
                      </p>
                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
                        {t(`catalog.${item.catalog}.label`)} ·{" "}
                        {t(`catalog.${item.catalog}.filters.${item.category}`)}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-foreground">
                      {formatPrice(item.price_cents)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>

            <fieldset>
              <legend className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
                {t("checkout.method")}
              </legend>
              <div className="mt-3 grid gap-2">
                {methods.map((item) => (
                  <label
                    key={item}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 text-[11px] uppercase tracking-[0.12em] transition-colors",
                      method === item
                        ? "border-wire-ink bg-wire-surface text-foreground"
                        : "border-wire-rule text-wire-ink-soft hover:border-wire-ink-soft",
                    )}
                  >
                    <span>{t(`checkout.${item}`)}</span>
                    <input
                      type="radio"
                      name="cart-payment-method"
                      value={item}
                      checked={method === item}
                      onChange={() => setMethod(item)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "h-3 w-3 rounded-full border",
                        method === item
                          ? "border-wire-ink bg-wire-ink"
                          : "border-wire-rule",
                      )}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="lg:sticky lg:top-[88px]">
            <Panel label={t("checkout.summary")} bodyClassName="p-0">
              <dl className="space-y-2 p-4 text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-wire-ink-soft">{t("cart.subtotal")}</dt>
                  <dd className="font-mono text-foreground">
                    {formatPrice(subtotalCents)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-wire-ink-soft">
                    {t("cart.discount")}
                    {coupon ? ` · ${coupon}` : ""}
                  </dt>
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
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-wire-ink-soft">{t("checkout.items")}</dt>
                  <dd className="font-mono text-foreground">{cartCount}</dd>
                </div>
              </dl>

              <div className="border-t border-wire-rule p-4">
                <Button size="lg" className="w-full" onClick={confirm}>
                  {t("checkout.pay")}
                  <ArrowRight aria-hidden strokeWidth={1.5} />
                </Button>
                <p className="mt-3 text-[9px] leading-relaxed text-wire-ink-soft">
                  {t("checkout.draft")}
                </p>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </Section>
  );
};

export default CartCheckoutPage;
