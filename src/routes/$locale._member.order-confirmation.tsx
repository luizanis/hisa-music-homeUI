import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AccessActions, OrderItems, OrderTotals, orderDestinations } from "@/components/member/order-summary";
import { EmptyState, OrderStatusBadge, Panel, SummaryRow } from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";
import { useOrders } from "@/lib/member-store";
import { translatedHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$locale/_member/order-confirmation")({
  validateSearch: (search: Record<string, unknown>): { order?: string | undefined } => ({
    order: typeof search["order"] === "string" ? search["order"].slice(0, 40) : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "confirm.metaTitle", "confirm.metaDescription").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { t } = useTranslation();
  const { to } = useLocale();
  const navigate = useNavigate();
  const { order: orderId } = Route.useSearch();
  const order = useOrders().find((entry) => entry.id === orderId);

  if (!order) {
    return (
      <EmptyState title={t("orders.notFound")}>
        <Button asChild variant="outline">
          <Link to={to("my-orders")}>{t("member.nav.orders")}</Link>
        </Button>
      </EmptyState>
    );
  }

  const tone = order.status === "paid" ? "paid" : order.status === "pending" ? "pending" : "failed";
  const Icon = tone === "paid" ? CheckCircle2 : tone === "pending" ? Clock : AlertCircle;
  const destinations = orderDestinations(order);

  return (
    <div className="mx-auto max-w-[760px] space-y-6">
      <div
        role="status"
        className={cn(
          "border p-5 sm:p-6",
          tone === "paid" && "border-wire-ink bg-wire-surface",
          tone === "pending" && "border-dashed border-wire-ink",
          tone === "failed" && "border-destructive",
        )}
      >
        <Icon
          aria-hidden
          className={cn("h-6 w-6", tone === "failed" ? "text-destructive" : "text-foreground")}
          strokeWidth={1.5}
        />
        <h1 className="mt-4 text-[24px] font-medium uppercase leading-none tracking-[-0.01em] text-foreground md:text-[30px]">
          {t(`confirm.${tone}.title`)}
        </h1>
        <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-wire-ink-soft">
          {t(`confirm.${tone}.text`)}
        </p>
      </div>

      <Panel title={t("confirm.summary")}>
        <div className="border-b border-wire-rule px-4 py-3">
          <SummaryRow label={t("orders.number")} value={order.id} />
          <SummaryRow label={t("orders.method")} value={t(`checkout.${order.method}`)} />
          <SummaryRow label={t("orders.status")} value={<OrderStatusBadge status={order.status} />} />
        </div>
        <OrderItems order={order} />
        <OrderTotals order={order} />
      </Panel>

      <Panel title={t("orders.nextSteps")}>
        <div className="space-y-4 p-4">
          {tone === "paid" ? (
            <>
              <ol className="list-decimal space-y-1.5 pl-4 text-[12px] leading-relaxed text-wire-ink-soft">
                {destinations.courses ? <li>{t("confirm.stepCourses")}</li> : null}
                {destinations.library ? <li>{t("confirm.stepLibrary")}</li> : null}
                {destinations.scheduled ? <li>{t("confirm.scheduled")}</li> : null}
                <li>{t("confirm.stepEmail")}</li>
              </ol>
              <AccessActions order={order} />
            </>
          ) : null}
          {tone === "pending" ? (
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to={`${to("my-orders")}/${order.id}`}>{t("confirm.trackOrder")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={to("dashboard")}>{t("member.nav.dashboard")}</Link>
              </Button>
            </div>
          ) : null}
          {tone === "failed" ? (
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void navigate({ href: to("checkout") })}>{t("orders.retry")}</Button>
              <Button asChild variant="outline">
                <Link to={to("contact")}>{t("dashboard.support")}</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </Panel>

      <p className="text-[11px] leading-relaxed text-wire-ink-soft">{t("confirm.simulated")}</p>
    </div>
  );
}
