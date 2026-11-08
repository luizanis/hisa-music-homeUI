import { Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAdminDemo } from "@/admin/admin-demo-store";
import { formatAdminDate } from "@/admin/admin-utils";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/i18n/routing";

const AdminAdministratorsPage = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { role, administrators } = useAdminDemo();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [nextRole, setNextRole] = useState<"owner" | "admin">("admin");

  if (role !== "owner") {
    return (
      <>
        <PageHeader
          label={t("admin.admins.label")}
          title={t("admin.admins.title")}
          description={t("admin.admins.description")}
        />
        <div className="mt-6">
          <AdminRestricted
            titleKey="admin.admins.restricted.title"
            textKey="admin.admins.restricted.text"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        label={t("admin.admins.label")}
        title={t("admin.admins.title")}
        description={t("admin.admins.description")}
        actions={
          <Button type="button" onClick={() => setOpen(true)}>
            <Plus aria-hidden strokeWidth={1.5} />
            {t("admin.admins.add")}
          </Button>
        }
      />

      <div className="mt-3 flex flex-col gap-2 border-l-2 border-wire-ink bg-wire-surface px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-relaxed text-wire-ink-soft">
          {t("admin.admins.demoNote")}
        </p>
        <p className="shrink-0 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
          {t("admin.admins.roleChangeNote")}
        </p>
      </div>

      <Panel className="mt-5" bodyClassName="p-0">
        <div className="hidden md:block">
          <table className="w-full caption-bottom text-left">
            <thead className="border-b border-wire-rule bg-wire-surface/40">
              <tr className="text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
                <th className="px-4 py-2.5 font-normal">{t("admin.admins.table.name")}</th>
                <th className="px-3 py-2.5 font-normal">{t("admin.admins.table.email")}</th>
                <th className="px-3 py-2.5 font-normal">{t("admin.admins.table.role")}</th>
                <th className="px-3 py-2.5 font-normal">{t("admin.admins.table.status")}</th>
                <th className="px-4 py-2.5 text-right font-normal">
                  {t("admin.admins.table.created")}
                </th>
              </tr>
            </thead>
            <tbody>
              {administrators.map((administrator) => (
                <tr
                  key={administrator.id}
                  className="border-b border-wire-rule last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center bg-primary font-mono text-[8px] text-primary-foreground">
                        {administrator.name.slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.08em] text-foreground">
                          {administrator.name}
                        </p>
                        {administrator.id === "adm-owner" ? (
                          <p className="text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
                            {t("admin.admins.current")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[9px] text-wire-ink-soft">
                    {administrator.email}
                  </td>
                  <td className="px-3 py-3">
                    <AdminStatusPill tone={administrator.role} />
                  </td>
                  <td className="px-3 py-3">
                    <AdminStatusPill tone={administrator.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-[9px] text-wire-ink-soft">
                    {formatAdminDate(administrator.createdAt, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="md:hidden">
          {administrators.map((administrator) => (
            <li
              key={administrator.id}
              className="border-b border-wire-rule p-4 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-foreground">
                    {administrator.name}
                  </p>
                  <p className="mt-0.5 text-[9px] text-wire-ink-soft">
                    {administrator.email}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <AdminStatusPill tone={administrator.role} />
                  <AdminStatusPill tone={administrator.status} />
                </div>
              </div>
              <p className="mt-2 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
                {t("admin.admins.table.created")}:{" "}
                {formatAdminDate(administrator.createdAt, locale)}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <p className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
        <ShieldCheck aria-hidden className="h-3 w-3" strokeWidth={1.5} />
        {t("admin.admins.noDelete")}
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md gap-0 border-wire-rule bg-background p-0 sm:rounded-[var(--radius)]">
          <DialogHeader className="border-b border-wire-rule p-5 text-left">
            <DialogTitle className="text-[14px] uppercase tracking-[0.1em] text-foreground">
              {t("admin.admins.addTitle")}
            </DialogTitle>
            <DialogDescription className="text-[11px] leading-relaxed text-wire-ink-soft">
              {t("admin.admins.addDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <Label
                htmlFor="admin-email"
                className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
              >
                {t("admin.admins.email")}
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@hisa.demo"
                className="h-9 rounded-[var(--radius)] border-wire-rule text-[11px]"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="admin-role"
                className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
              >
                {t("admin.admins.role")}
              </Label>
              <select
                id="admin-role"
                value={nextRole}
                onChange={(event) =>
                  setNextRole(event.target.value as "owner" | "admin")
                }
                className="h-9 w-full border border-wire-rule bg-background px-2 text-[10px] uppercase tracking-[0.1em] text-foreground"
              >
                <option value="admin">{t("admin.preview.admin")}</option>
                <option value="owner">{t("admin.preview.owner")}</option>
              </select>
            </div>
            <p className="border border-dashed border-wire-rule bg-wire-surface/40 px-3 py-2 text-[9px] leading-relaxed text-wire-ink-soft">
              {t("admin.admins.prototypeNote")}
            </p>
          </div>
          <DialogFooter className="flex-row items-center justify-end gap-2 border-t border-wire-rule p-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("admin.common.cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => {
                toast.info(t("admin.admins.prototypeNote"));
                setOpen(false);
              }}
              disabled={!email.trim()}
            >
              {t("admin.admins.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminAdministratorsPage;
