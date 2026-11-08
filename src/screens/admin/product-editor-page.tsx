import { ArrowLeft, FileQuestion } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "@/lib/router-compat";
import { toast } from "sonner";

import { useAdminDemo } from "@/admin/admin-demo-store";
import type { DemoProduct } from "@/admin/admin-types";
import { ProductForm } from "@/components/admin/product-form";
import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";

const blankProduct = (products: DemoProduct[]): DemoProduct => {
  const academyPositions = products
    .filter((product) => product.catalog === "academy")
    .map((product) => product.position);
  return {
    id: `demo-product-${Date.now()}`,
    slug: "",
    catalog: "academy",
    category: "courses",
    titlePt: "",
    titleEn: "",
    metaPt: "",
    metaEn: "",
    summaryPt: "",
    summaryEn: "",
    priceCents: 0,
    position: Math.max(-1, ...academyPositions) + 1,
    published: false,
    startsAt: null,
    includesPt: [],
    includesEn: [],
    modulesPt: [],
    modulesEn: [],
    updatedAt: new Date().toISOString(),
  };
};

const AdminProductEditorPage = () => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { products, saveProduct } = useAdminDemo();
  const [blank] = useState(() => blankProduct(products));

  const isNew = !slug;
  const product = slug
    ? products.find((entry) => entry.slug === slug)
    : undefined;

  if (!isNew && !product) {
    return (
      <>
        <PageHeader
          label={t("admin.products.label")}
          title={t("admin.products.form.notFoundTitle")}
          description={t("admin.products.form.notFoundText")}
        />
        <div className="mt-6">
          <EmptyState
            icon={FileQuestion}
            title={t("admin.products.form.notFoundTitle")}
            text={t("admin.products.form.notFoundText")}
          >
            <Button asChild variant="outline">
              <Link to={to("admin/products")}>
                <ArrowLeft aria-hidden strokeWidth={1.5} />
                {t("admin.products.title")}
              </Link>
            </Button>
          </EmptyState>
        </div>
      </>
    );
  }

  const initial = product ?? blank;

  return (
    <>
      <PageHeader
        label={t("admin.products.label")}
        title={
          isNew
            ? t("admin.products.form.newTitle")
            : t("admin.products.form.editTitle")
        }
        description={
          isNew
            ? t("admin.products.form.newDescription")
            : t("admin.products.form.editDescription")
        }
        actions={
          <Button asChild variant="outline">
            <Link to={to("admin/products")}>
              <ArrowLeft aria-hidden strokeWidth={1.5} />
              {t("admin.common.back")}
            </Link>
          </Button>
        }
      />

      <p className="mt-3 border-l-2 border-wire-ink bg-wire-surface px-3 py-2 text-[10px] leading-relaxed text-wire-ink-soft">
        {t("admin.products.demoNote")}
      </p>

      <div className="mt-5">
        <ProductForm
          key={initial.id}
          initial={initial}
          isNew={isNew}
          onSubmit={(next) => {
            saveProduct(next);
            toast.success(t("admin.products.form.saved"));
            navigate(to("admin/products"));
          }}
          onCancel={() => navigate(to("admin/products"))}
        />
      </div>
    </>
  );
};

export default AdminProductEditorPage;
