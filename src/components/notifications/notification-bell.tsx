import { ArrowRight, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "@/lib/router-compat";

import { NotificationCategoryIcon } from "@/components/notifications/notification-category-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale } from "@/i18n/routing";
import { formatDateTime } from "@/lib/account";
import { pickLocale } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/store/notification-store";

/** Header bell and compact inbox. Only rendered for authenticated users. */
export const NotificationBell = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { pathname, search, hash } = useLocation();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const key = pickLocale(locale);
  const recent = notifications.slice(0, 4);

  useEffect(() => {
    setOpen(false);
  }, [pathname, search, hash]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("notifications.bell")}
          className="relative flex h-8 w-8 items-center justify-center border border-wire-rule text-foreground transition-colors hover:bg-accent"
        >
          <Bell aria-hidden className="h-4 w-4" strokeWidth={1.5} />
          {unreadCount > 0 ? (
            <span className="sr-only">
              {t("notifications.unread", { count: unreadCount })}
            </span>
          ) : null}
          {unreadCount > 0 ? (
            <span
              aria-hidden
              className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-primary px-1 font-mono text-[9px] leading-none text-primary-foreground"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[calc(100vw-2rem)] max-w-[380px] border-wire-rule bg-background p-0 sm:w-[380px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-wire-rule px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-foreground">
              {t("notifications.title")}
            </p>
            {unreadCount > 0 ? (
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
                {t("notifications.unread", { count: unreadCount })}
              </p>
            ) : null}
          </div>

          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="text-right text-[9px] uppercase leading-relaxed tracking-[0.12em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 transition-colors hover:text-foreground"
            >
              {t("notifications.markAll")}
            </button>
          ) : null}
        </div>

        {recent.length === 0 ? (
          <p className="px-4 py-8 text-center text-[11px] leading-relaxed text-wire-ink-soft">
            {t("notifications.empty.short")}
          </p>
        ) : (
          <ul className="max-h-[min(60vh,380px)] overflow-y-auto">
            {recent.map((notification) => (
              <li
                key={notification.id}
                className={cn(
                  "border-b border-wire-rule last:border-b-0",
                  !notification.isRead && "bg-wire-surface/60",
                )}
              >
                <Link
                  to={to(notification.link)}
                  onClick={() => {
                    markRead(notification.id);
                    setOpen(false);
                  }}
                  className="flex gap-3 px-4 py-3 transition-colors hover:bg-wire-surface"
                >
                  <NotificationCategoryIcon
                    category={notification.category}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "text-[10px] uppercase leading-snug tracking-[0.06em]",
                          notification.isRead
                            ? "text-wire-ink-soft"
                            : "text-foreground",
                        )}
                      >
                        {notification.title[key]}
                      </span>
                      {!notification.isRead ? (
                        <span
                          aria-hidden
                          className="mt-1 h-1.5 w-1.5 shrink-0 bg-wire-ink"
                        />
                      ) : null}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[11px] leading-relaxed text-wire-ink-soft">
                      {notification.description[key]}
                    </span>
                    <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-wire-ink-soft">
                      {formatDateTime(notification.createdAt, locale)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          to={to("notifications")}
          onClick={() => setOpen(false)}
          className="flex items-center justify-between gap-3 px-4 py-3 text-[9px] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-wire-surface"
        >
          {t("notifications.viewAll")}
          <ArrowRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
        </Link>
      </PopoverContent>
    </Popover>
  );
};
