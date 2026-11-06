import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { socialLinks } from "@/data/socials";

export const SocialSection = () => {
  const { t } = useTranslation();

  return (
    <Section innerClassName="py-14 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="06" label={t("contact.social.label")} />
          <h2 className="mt-5 text-display-sm font-medium uppercase text-foreground">
            {t("contact.social.title")}
          </h2>
        </div>
        <p className="max-w-[38ch] text-[13px] leading-relaxed text-wire-ink-soft">
          {t("contact.social.lead")}
        </p>
      </div>

      <ul className="mt-10 grid gap-px border border-wire-rule bg-wire-rule sm:grid-cols-2 lg:grid-cols-4">
        {socialLinks.map((link) => (
          <li key={link.id} className="bg-background">
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-between gap-8 p-5 transition-colors hover:bg-wire-surface"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] uppercase leading-snug tracking-[0.14em] text-foreground">
                  {t(link.key)}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-3.5 w-3.5 shrink-0 text-wire-ink-soft transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </div>

              <span className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-wire-ink-soft">
                  {link.handle}
                </span>
                <span className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                  {t("contact.social.follow")}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
};
