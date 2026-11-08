import { ChevronDown, ReceiptText } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "@/lib/router-compat";

import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { StatusBadge } from "@/components/internal/status-badge";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/account";
import { useLocale } from "@/i18n/routing";
import {
  formatDate,
  orderSubtotal,
  orderTotal,
} from "@/lib/account";
import { formatPrice, pickLocale } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useAccount } from "@/store/account-store";

const MyOrdersPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { orders } = useAccount();
  const [searchParams] = useSearchParams();
  const requestedOrder = searchParams.get("order");
  const [expanded, setExpanded] = useState<string | null>(
    () => requestedOrder,
  );
  const key = pickLocale(locale);

  useEffect(() => {
    if (requestedOrder) setExpanded(requestedOrder);
  }, [requestedOrder]);

  const accessPath = (catalog: string, slug: string) => {
    if (catalog !== "academy") return to("my-library");
    return courses.some((course) => course.slug === slug)
      ? `${to("courses")}/${slug}/learn`
      : to("my-courses");
  };

  return (
    <>
      <PageHeader
        label={t("orders.label")}
        title={t("orders.title")}
        description={t("orders.lead")}
      />

      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ReceiptText}
            title={t("orders.empty.title")}
            text={t("orders.empty.text")}
          >
            <Button asChild>
              <Link to={to("academy")}>{t("orders.empty.cta")}</Link>
            </Button>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto border border-wire-rule">
            <table className="w-full min-w-[620px] border-collapse text-left md:min-w-0">
              <caption className="sr-only">{t("orders.title")}</caption>
              <thead className="hidden bg-wire-surface md:table-header-group">
                <tr>
                  {[
                    "orders.number",
                    "orders.date",
                    "orders.items",
                    "orders.total",
                    "orders.method",
                    "orders.status",
                  ].map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="border-b border-wire-rule px-4 py-3 text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                    >
                      {t(column)}
                    </th>
                  ))}
                  <th scope="col" className="border-b border-wire-rule px-4 py-3">
                    <span className="sr-only">{t("orders.view")}</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const isOpen = expanded === order.id;
                  return (
                    <Fragment key={order.id}>
                      <tr className="border-b border-wire-rule align-top last:border-b-0">
                        <td className="px-4 py-3">
                          <p className="font-mono text-[11px] text-foreground">
                            {order.id}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 md:hidden">
                            <span className="font-mono text-[10px] text-wire-ink-soft">
                              {formatDate(order.createdAt, locale)}
                            </span>
                            <span className="font-mono text-[10px] text-foreground">
                              {formatPrice(orderTotal(order))}
                            </span>
                            <StatusBadge status={order.status} />
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 text-[11px] text-wire-ink-soft md:table-cell">
                          {formatDate(order.createdAt, locale)}
                        </td>
                        <td className="hidden px-4 py-3 font-mono text-[11px] text-wire-ink-soft md:table-cell">
                          {order.items.length}
                        </td>
                        <td className="hidden px-4 py-3 font-mono text-[11px] text-foreground md:table-cell">
                          {formatPrice(orderTotal(order))}
                        </td>
                        <td className="hidden px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft md:table-cell">
                          {t(`orders.method.${order.method}`)}
                        </td>
                        <td className="hidden px-4 py-3 md:table-cell">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : order.id)}
                            aria-expanded={isOpen}
                            aria-controls={`order-detail-${order.id}`}
                            className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
                          >
                            {isOpen ? t("orders.hide") : t("orders.view")}
                            <ChevronDown
                              aria-hidden
                              className={cn(
                                "h-3.5 w-3.5 transition-transform",
                                isOpen && "rotate-180",
                              )}
                              strokeWidth={1.5}
                            />
                          </button>
                        </td>
                      </tr>

                      {isOpen ? (
                        <tr
                          id={`order-detail-${order.id}`}
                          className="scroll-mt-24 border-b border-wire-rule bg-wire-surface/40 last:border-b-0"
                        >
                          <td colSpan={7} className="px-4 py-5">
                            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]">
                              <div>
                                <p className="text-[9px] uppercase tracking-[0.18em] text-wire-ink-soft">
                                  {t("orders.items")}
                                </p>
                                <ul className="mt-3">
                                  {order.items.map((item) => (
                                    <li
                                      key={`${item.catalog}-${item.slug}`}
                                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-wire-rule py-2.5 first:pt-0 last:border-b-0"
                                    >
                                      <div className="min-w-0">
                                        <p className="text-[11px] uppercase tracking-[0.06em] text-foreground">
                                          {item.title[key]}
                                        </p>
                                        <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
                                          {t(`catalog.${item.catalog}.label`)} ·{" "}
                                          {t(
                                            `catalog.${item.catalog}.filters.${item.category}`,
                                          )}
                                        </p>
                                      </div>
                                      <div className="flex items-baseline gap-3">
                                        <span className="font-mono text-[11px] text-foreground">
                                          {formatPrice(item.price_cents)}
                                        </span>
                                        <Link
                                          to={accessPath(item.catalog, item.slug)}
                                          className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 hover:text-foreground"
                                        >
                                          {t("orders.access")}
                                        </Link>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="border-t border-wire-rule pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                                <p className="text-[9px] uppercase tracking-[0.18em] text-wire-ink-soft">
                                  {t("orders.summary")}
                                </p>
                                <dl className="mt-3 space-y-2 text-[11px]">
                                  <div className="flex items-center justify-between gap-3">
                                    <dt className="text-wire-ink-soft">
                                      {t("orders.subtotal")}
                                    </dt>
                                    <dd className="font-mono text-foreground">
                                      {formatPrice(orderSubtotal(order))}
                                    </dd>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <dt className="text-wire-ink-soft">
                                      {t("orders.discount")}
                                    </dt>
                                    <dd className="font-mono text-foreground">
                                      {order.discount_cents > 0
                                        ? `- ${formatPrice(order.discount_cents)}`
                                        : formatPrice(0)}
                                    </dd>
                                  </div>
                                  <div className="flex items-center justify-between gap-3 border-t border-wire-rule pt-2">
                                    <dt className="uppercase tracking-[0.12em] text-foreground">
                                      {t("orders.total")}
                                    </dt>
                                    <dd className="font-mono text-[13px] text-foreground">
                                      {formatPrice(orderTotal(order))}
                                    </dd>
                                  </div>
                                  <div className="flex items-center justify-between gap-3 pt-1">
                                    <dt className="text-wire-ink-soft">
                                      {t("orders.method")}
                                    </dt>
                                    <dd className="text-foreground">
                                      {t(`orders.method.${order.method}`)}
                                    </dd>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <dt className="text-wire-ink-soft">
                                      {t("orders.paymentStatus")}
                                    </dt>
                                    <dd>
                                      <StatusBadge status={order.status} />
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[10px] leading-relaxed text-wire-ink-soft">
            {t("orders.note")}
          </p>
        </>
      )}
    </>
  );
};

export default MyOrdersPage;
