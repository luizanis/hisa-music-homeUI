import { ImageOff, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { DemoProduct, ProductModule } from "@/admin/admin-types";
import { parsePriceInput, priceToInput, slugify } from "@/admin/admin-utils";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { catalogCategories, formatPrice, pickLocale } from "@/lib/catalog";
import { useLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type ProductFormProps = {
  initial: DemoProduct;
  isNew: boolean;
  onSubmit: (product: DemoProduct) => void;
  onCancel: () => void;
};

type FormErrors = Record<string, string>;

const fieldLabel = "text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft";
const fieldInput = "h-9 rounded-[var(--radius)] border-wire-rule text-[11px]";

export const ProductForm = ({
  initial,
  isNew,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [draft, setDraft] = useState<DemoProduct>(initial);
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const [price, setPrice] = useState(priceToInput(initial.priceCents));
  const [includesPt, setIncludesPt] = useState(initial.includesPt.join("\n"));
  const [includesEn, setIncludesEn] = useState(initial.includesEn.join("\n"));
  const [errors, setErrors] = useState<FormErrors>({});

  const localeKey = pickLocale(locale);
  const categoryOptions = useMemo(
    () => catalogCategories[draft.catalog],
    [draft.catalog],
  );

  const update = <K extends keyof DemoProduct>(key: K, value: DemoProduct[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const titleValue = language === "pt" ? draft.titlePt : draft.titleEn;
  const metaValue = language === "pt" ? draft.metaPt : draft.metaEn;
  const summaryValue = language === "pt" ? draft.summaryPt : draft.summaryEn;
  const modules = language === "pt" ? draft.modulesPt : draft.modulesEn;
  const includesValue = language === "pt" ? includesPt : includesEn;

  const setTitleValue = (value: string) =>
    setDraft((current) =>
      language === "pt" ? { ...current, titlePt: value } : { ...current, titleEn: value },
    );

  const setMetaValue = (value: string) =>
    setDraft((current) =>
      language === "pt" ? { ...current, metaPt: value } : { ...current, metaEn: value },
    );

  const setSummaryValue = (value: string) =>
    setDraft((current) =>
      language === "pt"
        ? { ...current, summaryPt: value }
        : { ...current, summaryEn: value },
    );

  const setIncludesValue = (value: string) => {
    if (language === "pt") setIncludesPt(value);
    else setIncludesEn(value);
  };

  const setModules = (next: ProductModule[]) => {
    setDraft((current) =>
      language === "pt"
        ? { ...current, modulesPt: next }
        : { ...current, modulesEn: next },
    );
  };

  const updateModule = (
    index: number,
    key: keyof ProductModule,
    value: string,
  ) => {
    setModules(
      modules.map((module, moduleIndex) =>
        moduleIndex === index ? { ...module, [key]: value } : module,
      ),
    );
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, moduleIndex) => moduleIndex !== index));
  };

  const addModule = () => {
    setModules([...modules, { title: "", detail: "" }]);
  };

  const submit = () => {
    const nextErrors: FormErrors = {};
    const parsedPrice = Number(price.replace(",", "."));
    const normalizedModules = modules.filter(
      (module) => module.title.trim() || module.detail.trim(),
    );

    if (!draft.slug.trim() || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug)) {
      nextErrors.slug = "admin.products.form.errors.slug";
    }
    if (!draft.titlePt.trim() || !draft.titleEn.trim()) {
      nextErrors.titles = "admin.products.form.errors.titleRequired";
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      nextErrors.price = "admin.products.form.errors.price";
    }
    if (!catalogCategories[draft.catalog].includes(draft.category)) {
      nextErrors.category = "admin.products.form.errors.category";
    }
    if (draft.position < 0) {
      nextErrors.position = "admin.products.form.errors.position";
    }
    if (
      normalizedModules.some(
        (module) => !module.title.trim() || !module.detail.trim(),
      )
    ) {
      nextErrors.modules = "admin.products.form.errors.modules";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...draft,
      slug: draft.slug.trim(),
      titlePt: draft.titlePt.trim(),
      titleEn: draft.titleEn.trim(),
      metaPt: draft.metaPt.trim(),
      metaEn: draft.metaEn.trim(),
      summaryPt: draft.summaryPt.trim(),
      summaryEn: draft.summaryEn.trim(),
      priceCents: Math.round(parsedPrice * 100),
      position: Math.max(0, Math.round(draft.position)),
      startsAt: draft.startsAt?.trim() ? draft.startsAt : null,
      includesPt: includesPt
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      includesEn: includesEn
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      modulesPt: language === "pt" ? normalizedModules : draft.modulesPt,
      modulesEn: language === "en" ? normalizedModules : draft.modulesEn,
      updatedAt: new Date().toISOString(),
    });
  };

  const previewTitle = localeKey === "en" ? draft.titleEn : draft.titlePt;
  const previewSummary = localeKey === "en" ? draft.summaryEn : draft.summaryPt;

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-5">
        <Panel label={t("admin.products.form.identity")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-slug" className={fieldLabel}>
                {t("admin.products.form.slug")}
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="product-slug"
                  value={draft.slug}
                  onChange={(event) => update("slug", slugify(event.target.value))}
                  className={fieldInput}
                  placeholder="introducao-producao-musical"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => update("slug", slugify(draft.titlePt))}
                  disabled={!draft.titlePt.trim()}
                  className="shrink-0"
                >
                  {t("admin.products.form.generateSlug")}
                </Button>
              </div>
              <p className="text-[9px] leading-relaxed text-wire-ink-soft">
                {t("admin.products.form.slugHint")}
              </p>
              {errors.slug ? (
                <p className="text-[10px] text-destructive">{t(errors.slug)}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-catalog" className={fieldLabel}>
                {t("admin.products.form.catalog")}
              </Label>
              <select
                id="product-catalog"
                value={draft.catalog}
                onChange={(event) => {
                  const catalog = event.target.value as "academy" | "sounds";
                  const nextCategory = catalogCategories[catalog][0];
                  setDraft((current) => ({
                    ...current,
                    catalog,
                    category: nextCategory,
                  }));
                }}
                className="h-9 w-full border border-wire-rule bg-background px-2 text-[10px] uppercase tracking-[0.1em] text-foreground"
              >
                <option value="academy">{t("catalog.academy.label")}</option>
                <option value="sounds">{t("catalog.sounds.label")}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-category" className={fieldLabel}>
                {t("admin.products.form.category")}
              </Label>
              <select
                id="product-category"
                value={draft.category}
                onChange={(event) => update("category", event.target.value)}
                className="h-9 w-full border border-wire-rule bg-background px-2 text-[10px] uppercase tracking-[0.1em] text-foreground"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {t(`catalog.${draft.catalog}.filters.${category}`)}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="text-[10px] text-destructive">{t(errors.category)}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-price" className={fieldLabel}>
                {t("admin.products.form.price")}
              </Label>
              <Input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className={fieldInput}
              />
              {errors.price ? (
                <p className="text-[10px] text-destructive">{t(errors.price)}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-position" className={fieldLabel}>
                {t("admin.products.form.position")}
              </Label>
              <Input
                id="product-position"
                type="number"
                min="0"
                value={draft.position}
                onChange={(event) =>
                  update("position", Number(event.target.value) || 0)
                }
                className={fieldInput}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-starts" className={fieldLabel}>
                {t("admin.products.form.startsAt")}
              </Label>
              <Input
                id="product-starts"
                type="datetime-local"
                value={draft.startsAt ?? ""}
                onChange={(event) => update("startsAt", event.target.value || null)}
                className={fieldInput}
              />
              <p className="text-[9px] leading-relaxed text-wire-ink-soft">
                {t("admin.products.form.startsAtHint")}
              </p>
            </div>
          </div>
        </Panel>

        <Panel
          label={t("admin.products.form.copy")}
          action={
            <div className="flex border border-wire-rule">
              {(["pt", "en"] as const).map((value, index) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLanguage(value)}
                  aria-pressed={language === value}
                  className={cn(
                    "h-7 px-2.5 text-[8px] uppercase tracking-[0.14em]",
                    index > 0 && "border-l border-wire-rule",
                    language === value
                      ? "bg-primary text-primary-foreground"
                      : "text-wire-ink-soft hover:text-foreground",
                  )}
                >
                  {t(`admin.products.form.${value}`)}
                </button>
              ))}
            </div>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`title-${language}`} className={fieldLabel}>
                {language === "pt"
                  ? t("admin.products.form.titlePt")
                  : t("admin.products.form.titleEn")}
              </Label>
              <Input
                id={`title-${language}`}
                value={titleValue}
                onChange={(event) => setTitleValue(event.target.value)}
                className={fieldInput}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`meta-${language}`} className={fieldLabel}>
                {language === "pt"
                  ? t("admin.products.form.metaPt")
                  : t("admin.products.form.metaEn")}
              </Label>
              <Input
                id={`meta-${language}`}
                value={metaValue}
                onChange={(event) => setMetaValue(event.target.value)}
                className={fieldInput}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`summary-${language}`} className={fieldLabel}>
                {language === "pt"
                  ? t("admin.products.form.summaryPt")
                  : t("admin.products.form.summaryEn")}
              </Label>
              <Textarea
                id={`summary-${language}`}
                value={summaryValue}
                onChange={(event) => setSummaryValue(event.target.value)}
                rows={3}
                className="rounded-[var(--radius)] border-wire-rule text-[11px]"
              />
            </div>
            {errors.titles ? (
              <p className="text-[10px] text-destructive">{t(errors.titles)}</p>
            ) : null}
          </div>
        </Panel>

        <Panel label={t("admin.products.form.content")}>
          <div className="space-y-2">
            <Label htmlFor={`includes-${language}`} className={fieldLabel}>
              {language === "pt"
                ? t("admin.products.form.includesPt")
                : t("admin.products.form.includesEn")}
            </Label>
            <Textarea
              id={`includes-${language}`}
              value={includesValue}
              onChange={(event) => setIncludesValue(event.target.value)}
              rows={4}
              className="rounded-[var(--radius)] border-wire-rule text-[11px]"
            />
            <p className="text-[9px] text-wire-ink-soft">
              {t("admin.products.form.includesHint")}
            </p>
          </div>

          <div className="mt-5 border-t border-wire-rule pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className={fieldLabel}>
                {language === "pt"
                  ? t("admin.products.form.modulesPt")
                  : t("admin.products.form.modulesEn")}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={addModule}>
                <Plus aria-hidden strokeWidth={1.5} />
                {t("admin.products.form.addModule")}
              </Button>
            </div>

            {modules.length === 0 ? (
              <p className="mt-3 border border-dashed border-wire-rule px-3 py-4 text-[10px] text-wire-ink-soft">
                {t("admin.products.form.noModules")}
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {modules.map((module, index) => (
                  <div
                    key={`${language}-${index}`}
                    className="border border-wire-rule bg-wire-surface/30 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(index)}
                      >
                        <Trash2 aria-hidden strokeWidth={1.5} />
                        {t("admin.products.form.removeModule")}
                      </Button>
                    </div>
                    <div className="mt-2 grid gap-2">
                      <Input
                        value={module.title}
                        onChange={(event) =>
                          updateModule(index, "title", event.target.value)
                        }
                        placeholder={t("admin.products.form.moduleTitle")}
                        className={fieldInput}
                      />
                      <Textarea
                        value={module.detail}
                        onChange={(event) =>
                          updateModule(index, "detail", event.target.value)
                        }
                        placeholder={t("admin.products.form.moduleDetail")}
                        rows={2}
                        className="rounded-[var(--radius)] border-wire-rule text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.modules ? (
              <p className="mt-2 text-[10px] text-destructive">
                {t(errors.modules)}
              </p>
            ) : null}
          </div>
        </Panel>
      </div>

      <div className="flex flex-col gap-5">
        <Panel label={t("admin.products.form.visibility")}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] text-foreground">
                {t("admin.products.form.published")}
              </p>
              <p className="mt-1 text-[9px] leading-relaxed text-wire-ink-soft">
                {t("admin.products.form.publishedHint")}
              </p>
            </div>
            <Switch
              checked={draft.published}
              onCheckedChange={(checked) => update("published", checked)}
              aria-label={t("admin.products.form.published")}
            />
          </div>
          <div className="mt-4 border-t border-wire-rule pt-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
                {t("admin.products.table.status")}
              </span>
              <AdminStatusPill
                tone={draft.published ? "published" : "unpublished"}
              />
            </div>
          </div>
        </Panel>

        <Panel label={t("admin.products.preview")}>
          <div className="border border-wire-rule bg-background">
            <div className="aspect-[4/3] w-full bg-wire-surface">
              <div className="flex h-full flex-col justify-between p-4">
                <span className="text-[8px] uppercase tracking-[0.16em] text-wire-ink-soft">
                  {t(`catalog.${draft.catalog}.filters.${draft.category}`)}
                </span>
                <p className="max-w-[18ch] text-[14px] font-medium uppercase leading-tight tracking-[0.04em] text-foreground">
                  {previewTitle || t("admin.products.previewTitle")}
                </p>
              </div>
            </div>
            <div className="border-t border-wire-rule p-3">
              <p className="font-mono text-[13px] text-foreground">
                {formatPrice(parsePriceInput(price) || 0)}
              </p>
              <p className="mt-2 line-clamp-3 text-[10px] leading-relaxed text-wire-ink-soft">
                {previewSummary || t("admin.products.previewSummary")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
            {t("admin.products.previewNote")}
          </p>
        </Panel>

        <Panel label={t("admin.products.form.imageTitle")}>
          <div className="flex flex-col items-center justify-center border border-dashed border-wire-rule bg-wire-surface/40 px-4 py-8 text-center">
            <ImageOff
              aria-hidden
              className="h-5 w-5 text-wire-ink-soft"
              strokeWidth={1.25}
            />
            <p className="mt-3 max-w-[26ch] text-[9px] leading-relaxed text-wire-ink-soft">
              {t("admin.products.form.imageNote")}
            </p>
          </div>
        </Panel>

        <div className="border border-wire-rule bg-wire-surface/40 p-4">
          <p className="text-[9px] uppercase tracking-[0.14em] text-foreground">
            {t("admin.common.designPreview")}
          </p>
          <p className="mt-1 text-[9px] leading-relaxed text-wire-ink-soft">
            {t("admin.products.form.prototypeNote")}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between xl:col-span-2">
        <p className="text-[9px] leading-relaxed text-wire-ink-soft">
          {t("admin.products.noDelete")}
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("admin.products.form.cancel")}
          </Button>
          <Button type="button" onClick={submit}>
            {isNew
              ? t("admin.products.form.create")
              : t("admin.products.form.save")}
          </Button>
        </div>
      </div>
    </div>
  );
};
