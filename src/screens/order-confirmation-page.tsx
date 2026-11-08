import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "@/lib/router-compat";

import { Panel } from "@/components/internal/panel";
import { StatusBadge } from "@/components/internal/status-badge";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";
import {
  formatDate,
  orderSubtotal,
  orderTotal,
} from "@/lib/account";
import { formatPrice, pickLocale } from "@/lib/catalog";
import { useAccount } from "@/store/account-store";

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { orders } = useAccount();
  const key = pickLocale(locale);

  const order = orders.find((entry) => entry.id === orderId);

  if (!order) {
    return (
      <Section innerClassName="py-16 md:py-20">
        <div className="mx-auto max-w-[520px]">
          <SectionLabel label={t("confirmation.label")} />
          <h1 className="mt-5 text-display-sm font-medium uppercase text-foreground">
            {t("confirmation.notFound")}
          </h1>
          <Button asChild variant="outline" className="mt-6">
            <Link to={to("my-orders")}>{t("confirmation.goOrders")}</Link>
          </Button>
        </div>
      </Section>
    );
  }

  const state: "paid" | "pending" | "failed" | "refunded" =
    order.status === "paid"
      ? "paid"
      : order.status === "pending"
        ? "pending"
        : order.status === "failed"
          ? "failed"
          : "refunded";

  const Icon =
    state === "paid"
      ? CheckCircle2
      : state === "pending"
        ? Clock3
        : state === "failed"
          ? XCircle
          : RotateCcw;

  const hasAcademy = order.items.some((item) => item.catalog === "academy");
  const hasSounds = order.items.some((item) => item.catalog === "sounds");

  return (
    <Section innerClassName="py-12 md:py-16">
      <div className="mx-auto max-w-[880px]">
        <SectionLabel label={t("confirmation.label")} />

        <div className="mt-6 flex items-start gap-4">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-wire-ink bg-wire-surface text-foreground"
          >
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <h1 className="text-display-sm font-medium uppercase text-foreground">
              {t(`confirmation.${state}.title`)}
            </h1>
            <p className="mt-3 max-w-[62ch] text-[13px] leading-relaxed text-wire-ink-soft">
              {t(`confirmation.${state}.lead`)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_280px]">
          <Panel label={t("confirmation.summary")} bodyClassName="p-0">
            <ul>
              {order.items.map((item) => (
                <li
                  key={`${item.catalog}-${item.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-wire-rule px-4 py-3"
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

            <dl className="space-y-2 p-4 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-wire-ink-soft">{t("orders.subtotal")}</dt>
                <dd className="font-mono text-foreground">
                  {formatPrice(orderSubtotal(order))}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-wire-ink-soft">{t("orders.discount")}</dt>
                <dd className="font-mono text-foreground">
                  {order.discount_cents > 0
                    ? `- ${formatPrice(order.discount_cents)}`
                    : formatPrice(0)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-wire-rule pt-2">
                <dt className="uppercase tracking-[0.12em] text-foreground">
                  {t("checkout.total")}
                </dt>
                <dd className="font-mono text-[14px] text-foreground">
                  {formatPrice(orderTotal(order))}
                </dd>
              </div>
            </dl>
          </Panel>

          <div className="flex flex-col gap-5">
            <Panel label={t("confirmation.order")}>
              <p className="break-all font-mono text-[13px] text-foreground">
                {order.id}
              </p>
              <dl className="mt-4 space-y-2 border-t border-wire-rule pt-3 text-[10px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                    {t("orders.date")}
                  </dt>
                  <dd className="font-mono text-foreground">
                    {formatDate(order.createdAt, locale)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                    {t("orders.method")}
                  </dt>
                  <dd className="text-foreground">
                    {t(`orders.method.${order.method}`)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                    {t("confirmation.status")}
                  </dt>
                  <dd>
                    <StatusBadge status={order.status} />
                  </dd>
                </div>
              </dl>
            </Panel>
          </div>
        </div>

        <Panel label={t("confirmation.nextSteps")} className="mt-5">
          <ol className="grid gap-4 sm:grid-cols-3">
            {["receipt", "access", "support"].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="font-mono text-[9px] text-wire-ink-soft">
                  0{index + 1}
                </span>
                <span className="text-[11px] leading-relaxed text-wire-ink-soft">
                  {t(`confirmation.step.${step}`)}
                </span>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {state === "paid" && hasAcademy ? (
            <Button asChild>
              <Link to={to("my-courses")}>
                {t("confirmation.goCourses")}
                <ArrowRight aria-hidden strokeWidth={1.5} />
              </Link>
            </Button>
          ) : null}
          {state === "paid" && hasSounds ? (
            <Button asChild variant={hasAcademy ? "outline" : "default"}>
              <Link to={to("my-library")}>
                {t("confirmation.goLibrary")}
                <ArrowRight aria-hidden strokeWidth={1.5} />
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link to={to("my-orders")}>{t("confirmation.goOrders")}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to={to("sounds")}>{t("confirmation.continue")}</Link>
          </Button>
        </div>

        <p className="mt-5 border-t border-wire-rule pt-4 text-[10px] leading-relaxed text-wire-ink-soft">
          {t("confirmation.demoNote")}
        </p>
      </div>
    </Section>
  );
};

export default OrderConfirmationPage;
