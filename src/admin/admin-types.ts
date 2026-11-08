export type AdminRole = "owner" | "admin";

export type ProductCatalog = "academy" | "sounds";

export type InquiryStatus = "new" | "read" | "handled";

export type AdministratorStatus = "active" | "inactive";

export type LocalizedText = { pt: string; en: string };

export type LocalizedList = { pt: string[]; en: string[] };

export type ProductModule = { title: string; detail: string };

export type ProductModules = { pt: ProductModule[]; en: ProductModule[] };

export type DemoProduct = {
  id: string;
  slug: string;
  catalog: ProductCatalog;
  category: string;
  titlePt: string;
  titleEn: string;
  metaPt: string;
  metaEn: string;
  summaryPt: string;
  summaryEn: string;
  priceCents: number;
  position: number;
  published: boolean;
  startsAt: string | null;
  includesPt: string[];
  includesEn: string[];
  modulesPt: ProductModule[];
  modulesEn: ProductModule[];
  updatedAt: string;
};

export type DemoInquiry = {
  id: string;
  name: string;
  email: string;
  area: string;
  locale: "pt" | "en";
  message: string;
  status: InquiryStatus;
  createdAt: string;
  readAt: string | null;
  handledAt: string | null;
};

export type DemoAdministrator = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdministratorStatus;
  createdAt: string;
};

export type DemoActivity = {
  id: string;
  createdAt: string;
  actor: string;
  actorRole: AdminRole;
  actionKey: string;
  target: string;
};
