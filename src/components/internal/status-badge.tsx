import { useTranslation } from "react-i18next";

import type { OrderStatus } from "@/store/account-store";
import { cn } from "@/lib/utils";

const styles: Record<OrderStatus, string> = {
  paid: "border-wire-ink text-foreground",
  pending: "border-dashed border-wire-ink-soft text-wire-ink-soft",
  failed: "border-destructive text-destructive",
  refunded: "border-wire-rule text-wire-ink-soft",
};

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-1 text-[9px] uppercase tracking-[0.16em]",
        styles[status],
      )}
    >
      <span aria-hidden className="h-1 w-1 shrink-0 bg-current" />
      {t(`orders.status.${status}`)}
    </span>
  );
};
