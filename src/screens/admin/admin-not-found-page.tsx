import { ArrowLeft, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";

const AdminNotFoundPage = () => {
  const { t } = useTranslation();
  const { to } = useLocale();

  return (
    <>
      <PageHeader
        label={t("admin.notFound.label")}
        title={t("admin.notFound.title")}
        description={t("admin.notFound.text")}
      />
      <div className="mt-6">
        <EmptyState
          icon={Compass}
          title={t("admin.notFound.title")}
          text={t("admin.notFound.text")}
        >
          <Button asChild variant="outline">
            <Link to={to("admin")}>
              <ArrowLeft aria-hidden strokeWidth={1.5} />
              {t("admin.notFound.action")}
            </Link>
          </Button>
        </EmptyState>
      </div>
    </>
  );
};

export default AdminNotFoundPage;
