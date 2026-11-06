import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState, FilterChips, OrderStatusBadge, PageHeader, formatDate } from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";
import { snapshotTitle, type Order, type OrderStatus } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { useOrders } from "@/lib/member-store";
import { translatedHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/_member/my-orders/")({
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "member.nav.orders", "orders.lead").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyOrdersPage,
});

const filters = ["all", "paid", "pending", "failed", "refunded"] as const;
type Filter = (typeof filters)[number];

const itemsLabel = (order: Order, locale: string, more: (count: number) => string) => {
  const first = order.items[0];
  if (!first) return "—";
  const title = snapshotTitle(first, locale);
  return order.items.length > 1 ? `${title} ${more(order.items.length - 1)}` : title;
};

function MyOrdersPage() {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const orders = useOrders();
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? orders : orders.filter((order) => order.status === filter);
  const more = (count: number) => t("orders.more", { count });

  return (
    <div className="space-y-6">
      <PageHeader label={t("member.group.purchases")} title={t("member.nav.orders")} lead={t("orders.lead")} />

      {orders.length === 0 ? (
        <EmptyState title={t("orders.emptyTitle")} text={t("orders.emptyText")}>
          <Button asChild>
            <Link to={to("academy")}>{t("nav.academy")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={to("sounds")}>{t("nav.sounds")}</Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterChips
              options={filters}
              value={filter}
              onChange={setFilter}
              label={t("orders.filterLabel")}
              renderLabel={(option) => (option === "all" ? t("courses.all") : t(`status.${option as OrderStatus}`))}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft">
              {visible.length} / {orders.length}
            </span>
          </div>

          {visible.length === 0 ? (
            <EmptyState title={t("orders.noMatch")} />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden border border-wire-rule md:block">
                <table className="w-full text-left">
                  <caption className="sr-only">{t("member.nav.orders")}</caption>
                  <thead>
                    <tr className="border-b border-wire-rule bg-wire-surface text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                      <th scope="col" className="px-4 py-3 font-normal">{t("orders.number")}</th>
                      <th scope="col" className="px-4 py-3 font-normal">{t("orders.date")}</th>
                      <th scope="col" className="px-4 py-3 font-normal">{t("orders.items")}</th>
                      <th scope="col" className="px-4 py-3 font-normal">{t("orders.method")}</th>
                      <th scope="col" className="px-4 py-3 font-normal">{t("orders.status")}</th>
                      <th scope="col" className="px-4 py-3 text-right font-normal">{t("checkout.total")}</th>
                      <th scope="col" className="px-4 py-3 font-normal"><span className="sr-only">{t("orders.details")}</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((order) => (
                      <tr key={order.id} className="border-b border-wire-rule text-[12px] last:border-b-0">
                        <td className="px-4 py-3 font-mono text-[11px] text-foreground">{order.id}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-wire-ink-soft">{formatDate(order.createdAt, locale)}</td>
                        <td className="max-w-[260px] px-4 py-3 text-foreground">
                          <span className="line-clamp-2">{itemsLabel(order, locale, more)}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-wire-ink-soft">{t(`checkout.${order.method}`)}</td>
                        <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-foreground">{formatPrice(order.total_cents)}</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`${to("my-orders")}/${order.id}`}
                            aria-label={`${t("orders.details")} ${order.id}`}
                            className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] uppercase tracking-[0.14em] text-foreground underline decoration-wire-rule underline-offset-4"
                          >
                            {t("orders.details")}
                            <ArrowRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                {visible.map((order) => (
                  <li key={order.id}>
                    <Link to={`${to("my-orders")}/${order.id}`} className="block border border-wire-rule p-4 transition-colors hover:border-wire-ink">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[12px] text-foreground">{order.id}</span>
                        <OrderStatusBadge status={order.status} />
                      </span>
                      <span className="mt-2 block text-[12px] text-foreground">{itemsLabel(order, locale, more)}</span>
                      <span className="mt-2 flex justify-between gap-3 text-[11px] text-wire-ink-soft">
                        <span>
                          {formatDate(order.createdAt, locale)} · {t(`checkout.${order.method}`)}
                        </span>
                        <span className="font-mono text-foreground">{formatPrice(order.total_cents)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
