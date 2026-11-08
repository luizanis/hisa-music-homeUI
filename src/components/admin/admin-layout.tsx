import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation, useParams } from "@/lib/router-compat";

import { AdminDemoProvider } from "@/admin/admin-demo-store";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminPreviewBanner } from "@/components/admin/admin-preview-banner";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { defaultLocale, isLocale, localePath } from "@/i18n/routing";

const AdminShell = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const activeLocale = segments[0];
    if (isLocale(activeLocale)) {
      void i18n.changeLanguage(activeLocale);
    }
  }, [i18n, pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-wire-ink focus:bg-background focus:px-3 focus:py-2 focus:text-[10px] focus:uppercase focus:tracking-[0.16em] focus:text-foreground"
      >
        {t("admin.skip")}
      </a>

      <AdminPreviewBanner />

      <div className="mx-auto flex w-full max-w-[1680px]">
        <aside className="hidden w-[248px] shrink-0 border-r border-wire-rule lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <AdminSidebar />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <AdminHeader onOpenMenu={() => setMenuOpen(true)} />
          <main
            id="admin-main"
            className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            <AdminBreadcrumbs />
            <div className="mt-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="w-[88vw] max-w-[320px] border-r-wire-rule bg-background p-0"
        >
          <SheetTitle className="sr-only">{t("admin.menu")}</SheetTitle>
          <AdminSidebar onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

const AdminLayout = () => {
  const { locale } = useParams<{ locale: string }>();
  const { pathname } = useLocation();

  if (!isLocale(locale)) {
    const segments = pathname.split("/").filter(Boolean);
    const rest = segments.slice(1).join("/");
    return <Navigate to={localePath(defaultLocale, rest)} replace />;
  }

  return (
    <AdminDemoProvider>
      <AdminShell />
    </AdminDemoProvider>
  );
};

export default AdminLayout;
