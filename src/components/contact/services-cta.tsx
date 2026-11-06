import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppLink as Link } from "@/components/site/app-link";

import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";

export const ServicesCta = () => {
  const { t } = useTranslation();
  const { to } = useLocale();

  return (
    <Section innerClassName="py-10">
      <div className="flex justify-center">
        <Button asChild size="lg">
          <Link to={`${to("contact")}#briefing`}>
            {t("contact.services.areaCta")}
            <ArrowUpRight aria-hidden strokeWidth={1.5} />
          </Link>
        </Button>
      </div>
    </Section>
  );
};
