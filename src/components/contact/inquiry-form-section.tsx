import { ArrowUpRight, Check } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearch } from "@tanstack/react-router";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/i18n/routing";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const areas = [
  "music",
  "academy",
  "sounds",
  "custom",
  "brands",
  "consulting",
  "show",
] as const;
type Area = (typeof areas)[number];

type FormValues = {
  name: string;
  email: string;
  area: Area | "";
  message: string;
};

const emptyValues: FormValues = {
  name: "",
  email: "",
  area: "",
  message: "",
};

/** Catalog cards link here with the product they want, pre-filling the brief. */
const readPrefill = (
  search: Record<string, unknown>,
): { product: string; area: Area | "" } => {
  const rawProduct = search["product"];
  const rawArea = search["area"];
  const product = typeof rawProduct === "string" ? rawProduct.trim().slice(0, 90) : "";
  const area = typeof rawArea === "string" ? rawArea : "";

  return {
    product,
    area: areas.includes(area as Area) ? (area as Area) : "",
  };
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldProps = {
  label: string;
  htmlFor?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  children: ReactNode;
};

const Field = ({ label, htmlFor, hint, error, children }: FieldProps) => (
  <div className="space-y-2">
    <Label
      htmlFor={htmlFor}
      className="text-[10px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
    >
      {label}
    </Label>
    {children}
    {error ? (
      <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
    ) : hint ? (
      <p className="text-[11px] leading-relaxed text-wire-ink-soft/80">
        {hint}
      </p>
    ) : null}
  </div>
);

const inputStyles =
  "h-11 rounded-[var(--radius)] border-wire-rule bg-background px-3 text-[13px] placeholder:text-wire-ink-soft/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0";

export const InquiryFormSection = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  const prefill = readPrefill(search);

  const initialValues = useMemo<FormValues>(
    () => ({
      ...emptyValues,
      area: prefill.area,
      message: prefill.product
        ? t("contact.form.prefill", { product: prefill.product })
        : "",
    }),
    [prefill.area, prefill.product, t],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: initialValues });

  const selectedArea = watch("area");

  const onSubmit = async (values: FormValues) => {
    let hasError = false;

    if (!values.name.trim()) {
      setError("name", { message: t("contact.form.errors.name") });
      hasError = true;
    }
    if (!emailPattern.test(values.email.trim())) {
      setError("email", { message: t("contact.form.errors.email") });
      hasError = true;
    }
    if (!values.area) {
      setError("area", { message: t("contact.form.errors.area") });
      hasError = true;
    }
    if (values.message.trim().length < 20) {
      setError("message", { message: t("contact.form.errors.message") });
      hasError = true;
    }

    if (hasError || !values.area) return;

    setStatus("sending");

    const { error } = await supabase.from("contact_inquiries").insert({
      name: values.name.trim(),
      email: values.email.trim(),
      area: values.area,
      message: values.message.trim(),
      locale,
    });

    if (error) {
      console.error("Contact inquiry failed:", error.message);
      setStatus("error");
      return;
    }

    reset(initialValues);
    setStatus("success");
  };

  const isSending = status === "sending";

  return (
    <Section id="briefing" className="scroll-mt-20" innerClassName="py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionLabel label={t("contact.form.label")} />
          <h2 className="mt-5 max-w-[18ch] text-display-sm font-medium uppercase text-foreground">
            {t("contact.form.title")}
          </h2>
          <p className="mt-5 max-w-[38ch] text-[13px] leading-relaxed text-wire-ink-soft">
            {t("contact.form.lead")}
          </p>

          <div className="mt-10 border-t border-wire-rule pt-5">
            <p className="text-label uppercase text-wire-ink-soft">
              {t("contact.direct.label")}
            </p>
            <a
              href={`mailto:${t("contact.direct.email")}`}
              className="mt-3 inline-block text-[14px] text-foreground underline decoration-wire-rule underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {t("contact.direct.email")}
            </a>
            <p className="mt-3 max-w-[30ch] text-[12px] leading-relaxed text-wire-ink-soft">
              {t("contact.direct.note")}
            </p>
          </div>
        </div>

        <div className="border border-wire-rule bg-background p-5 sm:p-7">
          {status === "success" ? (
            <div role="status" className="flex flex-col items-start py-4">
              <span className="flex h-9 w-9 items-center justify-center border border-wire-ink">
                <Check aria-hidden className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-[14px] uppercase tracking-[0.12em] text-foreground">
                {t("contact.form.success.title")}
              </h3>
              <p className="mt-3 max-w-[42ch] text-[13px] leading-relaxed text-wire-ink-soft">
                {t("contact.form.success.text")}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-6"
                onClick={() => setStatus("idle")}
              >
                {t("contact.form.success.again")}
              </Button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label={t("contact.form.name")}
                  htmlFor="contact-name"
                  error={errors.name?.message}
                >
                  <Input
                    id="contact-name"
                    autoComplete="name"
                    maxLength={120}
                    placeholder={t("contact.form.namePlaceholder")}
                    aria-invalid={Boolean(errors.name)}
                    className={cn(inputStyles, errors.name && "border-destructive")}
                    {...register("name")}
                  />
                </Field>

                <Field
                  label={t("contact.form.email")}
                  htmlFor="contact-email"
                  error={errors.email?.message}
                >
                  <Input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    maxLength={200}
                    placeholder={t("contact.form.emailPlaceholder")}
                    aria-invalid={Boolean(errors.email)}
                    className={cn(
                      inputStyles,
                      errors.email && "border-destructive",
                    )}
                    {...register("email")}
                  />
                </Field>
              </div>

              <Field
                label={t("contact.form.area")}
                error={errors.area?.message}
              >
                <Select
                  value={selectedArea ?? ""}
                  onValueChange={(value) => {
                    setValue("area", value as Area, { shouldDirty: true });
                    clearErrors("area");
                  }}
                >
                  <SelectTrigger
                    aria-label={t("contact.form.area")}
                    aria-invalid={Boolean(errors.area)}
                    className={cn(
                      inputStyles,
                      "text-left",
                      errors.area && "border-destructive",
                    )}
                  >
                    <SelectValue
                      placeholder={t("contact.form.areaPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {t(`contact.form.areas.${area}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label={t("contact.form.message")}
                htmlFor="contact-message"
                hint={t("contact.form.messageHint")}
                error={errors.message?.message}
              >
                <Textarea
                  id="contact-message"
                  rows={6}
                  maxLength={4000}
                  placeholder={t("contact.form.messagePlaceholder")}
                  aria-invalid={Boolean(errors.message)}
                  className={cn(
                    "rounded-[var(--radius)] border-wire-rule bg-background px-3 py-2.5 text-[13px] leading-relaxed placeholder:text-wire-ink-soft/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
                    errors.message && "border-destructive",
                  )}
                  {...register("message")}
                />
              </Field>

              {status === "error" ? (
                <p
                  role="alert"
                  className="border border-destructive/40 bg-destructive/5 px-3 py-2.5 text-[12px] leading-relaxed text-destructive"
                >
                  {t("contact.form.errors.generic")}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-wire-rule pt-5">
                <p className="max-w-[34ch] text-[11px] leading-relaxed text-wire-ink-soft">
                  {t("contact.form.privacy")}
                </p>
                <Button type="submit" size="lg" disabled={isSending}>
                  {isSending
                    ? t("contact.form.sending")
                    : t("contact.form.submit")}
                  <ArrowUpRight aria-hidden strokeWidth={1.5} />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
};
