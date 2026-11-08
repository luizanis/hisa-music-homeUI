import {
  GraduationCap,
  Megaphone,
  MessagesSquare,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

import type { NotificationCategory } from "@/data/notifications";
import { cn } from "@/lib/utils";

const icons: Record<NotificationCategory, LucideIcon> = {
  community: MessagesSquare,
  learning: GraduationCap,
  orders: ReceiptText,
  academy: Megaphone,
};

type NotificationCategoryIconProps = {
  category: NotificationCategory;
  className?: string;
};

export const NotificationCategoryIcon = ({
  category,
  className,
}: NotificationCategoryIconProps) => {
  const Icon = icons[category];

  return (
    <span
      aria-hidden
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center border border-wire-rule bg-background text-wire-ink-soft",
        className,
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </span>
  );
};
