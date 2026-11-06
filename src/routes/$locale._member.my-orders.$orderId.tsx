import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AccessActions, OrderItems, OrderTotals, orderDestinations } from "@/components/member/order-summary";
import { EmptyState, OrderStatusBadge, PageHeader, Panel, SummaryRow, formatDate } from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import { Button } from "@/components/ui/button";
import { translate } from "@/i18n/config";
import { useLocale } from "@/i18n/routing";
import { cartActions, useOrders } from "@/lib/member-store";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/_member/my-orders/$orderId")({
  head: ({ params }) => ({
    meta: [
      ...pageHead(params.locale, {
        title: `${translate(params.locale, "orders.order")} ${params.orderId}`,
        description: translate(params.locale, "orders.lead"),
      }).meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const navigate = useNavigate();
  const order = useOrders().find((entry) => entry.id === orderId);

  const back = (
    <Link
      to={to("my-orders")}
      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft transition-colors hover:text-foreground"
    >
      <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
      {t("orders.back")}
    </Link>
  );

  if (!order) {
    return (
      <div className="space-y-6">
        {back}
        <EmptyState title={t("orders.notFound")}>
          <Button asChild variant="outline">
            <Link to={to("my-orders")}>{t("orders.back")}</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const destinations = orderDestinations(order);

  const retry = () => {
    order.items.forEach((item) => cartActions.add(item));
    void navigate({ href: to("checkout") });
  };

  return (
    <div className="space-y-6">
      {back}
      <PageHeader
        label={t("member.nav.orders")}
        title={`${t("orders.order")} ${order.id}`}
        lead={formatDate(order.createdAt, locale, true)}
        actions={<OrderStatusBadge status={order.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Panel title={t("orders.items")}>
          <OrderItems order={order} />
          <OrderTotals order={order} />
        </Panel>

        <div className="space-y-4">
          <Panel title={t("orders.payment")}>
            <div className="px-4 py-3">
              <SummaryRow label={t("orders.method")} value={t(`checkout.${order.method}`)} />
              <SummaryRow label={t("orders.status")} value={<OrderStatusBadge status={order.status} />} />
              <SummaryRow label={t("orders.date")} value={formatDate(order.createdAt, locale)} />
              <SummaryRow label={t("checkout.total")} value={order.total_cents ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.total_cents / 100) : "—"} />
            </div>
            <p className="border-t border-wire-rule px-4 py-3 text-[11px] leading-relaxed text-wire-ink-soft">
              {t(`orders.statusNote.${order.status}`)}
            </p>
          </Panel>

          <Panel title={t("orders.nextSteps")}>
            <div className="space-y-3 p-4">
              {order.status === "paid" ? (
                <>
                  <AccessActions order={order} />
                  {destinations.scheduled ? (
                    <p className="text-[11px] leading-relaxed text-wire-ink-soft">{t("confirm.scheduled")}</p>
                  ) : null}
                </>
              ) : null}
              {order.status === "failed" ? (
                <Button onClick={retry}>{t("orders.retry")}</Button>
              ) : null}
              {order.status === "pending" || order.status === "refunded" ? (
                <Button asChild variant="outline">
                  <Link to={to("contact")}>{t("dashboard.support")}</Link>
                </Button>
              ) : null}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
