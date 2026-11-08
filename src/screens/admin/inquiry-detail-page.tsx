import { ArrowLeft, FileQuestion, Mail, Reply } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "@/lib/router-compat";
import { toast } from "sonner";

import { useAdminDemo } from "@/admin/admin-demo-store";
import { formatAdminDateTime } from "@/admin/admin-utils";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";

const AdminInquiryDetailPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { id } = useParams<{ id: string }>();
  const { inquiries, setInquiryStatus } = useAdminDemo();

  const inquiry = inquiries.find((entry) => entry.id === id);

  if (!inquiry) {
    return (
      <>
        <PageHeader
          label={t("admin.inquiries.label")}
          title={t("admin.inquiries.detail.notFound")}
          description={t("admin.inquiries.empty.text")}
        />
        <div className="mt-6">
          <EmptyState
            icon={FileQuestion}
            title={t("admin.inquiries.detail.notFound")}
            text={t("admin.inquiries.empty.text")}
          >
            <Button asChild variant="outline">
              <Link to={to("admin/inquiries")}>
                <ArrowLeft aria-hidden strokeWidth={1.5} />
                {t("admin.inquiries.detail.back")}
              </Link>
            </Button>
          </EmptyState>
        </div>
      </>
    );
  }

  const changeStatus = (status: "new" | "read" | "handled") => {
    setInquiryStatus(inquiry.id, status);
    toast.success(t("admin.inquiries.detail.updated"));
  };

  const rows = [
    {
      label: t("admin.inquiries.detail.area"),
      value: t(`contact.form.areas.${inquiry.area}`),
    },
    {
      label: t("admin.inquiries.detail.locale"),
      value: inquiry.locale.toUpperCase(),
    },
    {
      label: t("admin.inquiries.detail.received"),
      value: formatAdminDateTime(inquiry.createdAt, locale),
    },
    {
      label: t("admin.inquiries.detail.readAt"),
      value: inquiry.readAt
        ? formatAdminDateTime(inquiry.readAt, locale)
        : t("admin.common.notYet"),
    },
    {
      label: t("admin.inquiries.detail.handledAt"),
      value: inquiry.handledAt
        ? formatAdminDateTime(inquiry.handledAt, locale)
        : t("admin.common.notYet"),
    },
  ];

  return (
    <>
      <PageHeader
        label={t("admin.inquiries.label")}
        title={inquiry.name}
        description={inquiry.email}
        actions={
          <>
            <AdminStatusPill tone={inquiry.status} />
            <Button asChild variant="outline">
              <Link to={to("admin/inquiries")}>
                <ArrowLeft aria-hidden strokeWidth={1.5} />
                {t("admin.inquiries.detail.back")}
              </Link>
            </Button>
          </>
        }
      />

      <p className="mt-3 border-l-2 border-wire-ink bg-wire-surface px-3 py-2 text-[10px] leading-relaxed text-wire-ink-soft">
        {t("admin.inquiries.demoNote")}
      </p>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <Panel label={t("admin.inquiries.detail.message")}>
          <div className="border border-wire-rule bg-wire-surface/30 p-4">
            <p className="whitespace-pre-line break-words text-[13px] leading-relaxed text-foreground">
              {inquiry.message}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
            <Mail aria-hidden className="h-3 w-3" strokeWidth={1.5} />
            {inquiry.email}
          </div>
        </Panel>

        <div className="flex flex-col gap-5">
          <Panel label={t("admin.inquiries.detail.contact")}>
            <dl className="space-y-2.5">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 border-b border-wire-rule pb-2 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[8.5px] uppercase tracking-[0.14em] text-wire-ink-soft">
                    {row.label}
                  </dt>
                  <dd className="max-w-[60%] text-right text-[10px] text-foreground">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel label={t("admin.inquiries.detail.actions")}>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant={inquiry.status === "new" ? "default" : "outline"}
                disabled={inquiry.status !== "new"}
                onClick={() => changeStatus("read")}
                className="w-full justify-start"
              >
                {t("admin.inquiries.detail.markRead")}
              </Button>
              <Button
                type="button"
                variant={inquiry.status === "read" ? "default" : "outline"}
                disabled={inquiry.status === "handled"}
                onClick={() => changeStatus("handled")}
                className="w-full justify-start"
              >
                {t("admin.inquiries.detail.markHandled")}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={inquiry.status !== "handled"}
                onClick={() => changeStatus("new")}
                className="w-full justify-start"
              >
                {t("admin.inquiries.detail.reopen")}
              </Button>
            </div>
            <div className="mt-4 border-t border-wire-rule pt-3">
              <Button
                type="button"
                variant="outline"
                disabled
                className="w-full justify-start border-dashed"
              >
                <Reply aria-hidden strokeWidth={1.5} />
                {t("admin.inquiries.detail.reply")}
              </Button>
              <p className="mt-2 text-[9px] leading-relaxed text-wire-ink-soft">
                {t("admin.inquiries.detail.replyNote")}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
};

export default AdminInquiryDetailPage;
