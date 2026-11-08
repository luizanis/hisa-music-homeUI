import { BellOff, Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { NotificationCategoryIcon } from "@/components/notifications/notification-category-icon";
import { Button } from "@/components/ui/button";
import {
  notificationCategories,
  type NotificationCategory,
} from "@/data/notifications";
import { useLocale } from "@/i18n/routing";
import { formatDateTime } from "@/lib/account";
import { pickLocale } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useAccount } from "@/store/account-store";
import { useNotifications } from "@/store/notification-store";

const filterOptions = ["all", ...notificationCategories] as const;
type Filter = (typeof filterOptions)[number];

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { isSignedIn } = useAccount();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();
  const [filter, setFilter] = useState<Filter>("all");
  const key = pickLocale(locale);

  const visible =
    filter === "all"
      ? notifications
      : notifications.filter(
          (notification) => notification.category === filter,
        );

  const countFor = (option: Filter) =>
    option === "all"
      ? notifications.length
      : notifications.filter(
          (notification) => notification.category === option,
        ).length;

  return (
    <>
      <PageHeader
        label={t("notifications.label")}
        title={t("notifications.pageTitle")}
        description={t("notifications.pageLead")}
        actions={
          isSignedIn ? (
            <Button
              type="button"
              variant="outline"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <Check aria-hidden strokeWidth={1.5} />
              {t("notifications.markAll")}
            </Button>
          ) : undefined
        }
      />

      {!isSignedIn ? (
        <div className="mt-6">
          <EmptyState
            icon={BellOff}
            title={t("notifications.signInTitle")}
            text={t("notifications.signInText")}
          >
            <Button asChild>
              <Link to={to("signin")}>{t("notifications.signIn")}</Link>
            </Button>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => {
              const active = filter === option;
              const count = countFor(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-2 border px-3 py-2 text-[9px] uppercase tracking-[0.16em] transition-colors",
                    active
                      ? "border-wire-ink bg-primary text-primary-foreground"
                      : "border-wire-rule text-wire-ink-soft hover:border-wire-ink-soft hover:text-foreground",
                  )}
                >
                  {t(
                    option === "all"
                      ? "notifications.category.all"
                      : `notifications.category.${option}`,
                  )}
                  <span
                    className={cn(
                      "font-mono text-[9px]",
                      active
                        ? "text-primary-foreground/70"
                        : "text-wire-ink-soft",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={BellOff}
                title={t("notifications.empty.title")}
                text={t("notifications.empty.text")}
              >
                {filter !== "all" ? (
                  <Button variant="outline" onClick={() => setFilter("all")}>
                    {t("notifications.showAll")}
                  </Button>
                ) : null}
              </EmptyState>
            </div>
          ) : (
            <ul className="mt-6 border border-wire-rule bg-background">
              {visible.map((notification) => (
                <li
                  key={notification.id}
                  className={cn(
                    "flex items-stretch border-b border-wire-rule last:border-b-0",
                    !notification.isRead && "bg-wire-surface/60",
                  )}
                >
                  <Link
                    to={to(notification.link)}
                    onClick={() => markRead(notification.id)}
                    className="flex min-w-0 flex-1 gap-3 px-4 py-4 transition-colors hover:bg-wire-surface sm:px-5"
                  >
                    <NotificationCategoryIcon
                      category={notification.category}
                      className="h-9 w-9"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            "text-[11px] uppercase leading-snug tracking-[0.06em]",
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

                      <span className="mt-1 block max-w-[72ch] text-[12px] leading-relaxed text-wire-ink-soft">
                        {notification.description[key]}
                      </span>

                      <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.1em] text-wire-ink-soft">
                        {formatDateTime(notification.createdAt, locale)}
                      </span>
                    </span>
                  </Link>

                  {!notification.isRead ? (
                    <div className="flex items-start px-3 py-4 sm:px-4">
                      <button
                        type="button"
                        onClick={() => markRead(notification.id)}
                        aria-label={t("notifications.markRead")}
                        title={t("notifications.markRead")}
                        className="flex h-8 w-8 items-center justify-center border border-wire-rule text-wire-ink-soft transition-colors hover:border-wire-ink hover:text-foreground"
                      >
                        <Check
                          aria-hidden
                          className="h-3.5 w-3.5"
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 text-[10px] leading-relaxed text-wire-ink-soft">
            {t("notifications.demoNote")}
          </p>
        </>
      )}
    </>
  );
};

export default NotificationsPage;
