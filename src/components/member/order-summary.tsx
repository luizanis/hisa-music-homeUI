import { useTranslation } from "react-i18next";

import { CartLine } from "@/components/cart/cart-drawer";
import { SummaryRow } from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";
import type { Order } from "@/lib/cart";
import { formatPrice, hasInstantAccess } from "@/lib/catalog";

/** Where a paid order's items can be opened. */
export const orderDestinations = (order: Order) => ({
  courses: order.items.some((item) => item.catalog === "academy" && hasInstantAccess(item.category)),
  library: order.items.some((item) => item.catalog === "sounds"),
  scheduled: order.items.some((item) => item.catalog === "academy" && !hasInstantAccess(item.category)),
});

export const OrderItems = ({ order }: { order: Order }) => (
  <ul className="px-4">
    {order.items.map((item) => (
      <CartLine key={item.slug} item={item} />
    ))}
  </ul>
);

export const OrderTotals = ({ order }: { order: Order }) => {
  const { t } = useTranslation();
  return (
    <div className="border-t border-wire-rule px-4 py-3">
      <SummaryRow label={t("cart.subtotal")} value={formatPrice(order.subtotal_cents)} />
      {order.discount_cents > 0 ? (
        <SummaryRow
          label={`${t("cart.discount")}${order.coupon ? ` · ${order.coupon}` : ""}`}
          value={`− ${formatPrice(order.discount_cents)}`}
        />
      ) : null}
      <SummaryRow label={t("checkout.total")} value={formatPrice(order.total_cents)} strong />
    </div>
  );
};

/** "Go to My Courses / My Library" actions for a paid order. */
export const AccessActions = ({ order }: { order: Order }) => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const destinations = orderDestinations(order);

  return (
    <div className="flex flex-wrap gap-2">
      {destinations.courses ? (
        <Button asChild>
          <Link to={to("my-courses")}>{t("confirm.goCourses")}</Link>
        </Button>
      ) : null}
      {destinations.library ? (
        <Button asChild variant={destinations.courses ? "outline" : "default"}>
          <Link to={to("my-library")}>{t("confirm.goLibrary")}</Link>
        </Button>
      ) : null}
    </div>
  );
};
