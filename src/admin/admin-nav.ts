import {
  Award,
  BarChart3,
  Disc3,
  GraduationCap,
  History,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  MessagesSquare,
  Package,
  Percent,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  id: string;
  path: string;
  labelKey: string;
  icon: LucideIcon;
  ownerOnly?: boolean;
  planned?: boolean;
};

export type AdminNavGroup = {
  id: string;
  labelKey: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "operations",
    labelKey: "admin.group.operations",
    items: [
      {
        id: "overview",
        path: "",
        labelKey: "admin.nav.overview",
        icon: LayoutDashboard,
      },
      {
        id: "products",
        path: "products",
        labelKey: "admin.nav.products",
        icon: Package,
      },
      {
        id: "inbox",
        path: "inquiries",
        labelKey: "admin.nav.inbox",
        icon: Inbox,
      },
    ],
  },
  {
    id: "academy",
    labelKey: "admin.group.academy",
    items: [
      {
        id: "academy-courses",
        path: "academy/courses",
        labelKey: "admin.nav.courses",
        icon: GraduationCap,
        planned: true,
      },
      {
        id: "academy-students",
        path: "academy/students",
        labelKey: "admin.nav.students",
        icon: Users,
        planned: true,
      },
      {
        id: "academy-certificates",
        path: "academy/certificates",
        labelKey: "admin.nav.certificates",
        icon: Award,
        planned: true,
      },
      {
        id: "academy-community",
        path: "academy/community",
        labelKey: "admin.nav.community",
        icon: MessagesSquare,
        planned: true,
      },
    ],
  },
  {
    id: "business",
    labelKey: "admin.group.business",
    items: [
      {
        id: "business-sales",
        path: "business/sales",
        labelKey: "admin.nav.sales",
        icon: ReceiptText,
        planned: true,
      },
      {
        id: "business-marketing",
        path: "business/marketing",
        labelKey: "admin.nav.marketing",
        icon: Percent,
        planned: true,
      },
      {
        id: "business-analytics",
        path: "business/analytics",
        labelKey: "admin.nav.analytics",
        icon: BarChart3,
        planned: true,
      },
    ],
  },
  {
    id: "content",
    labelKey: "admin.group.content",
    items: [
      {
        id: "content-website",
        path: "content/website",
        labelKey: "admin.nav.website",
        icon: LayoutTemplate,
        planned: true,
      },
      {
        id: "content-music",
        path: "content/music",
        labelKey: "admin.nav.music",
        icon: Disc3,
        planned: true,
      },
      {
        id: "content-announcements",
        path: "content/announcements",
        labelKey: "admin.nav.announcements",
        icon: Megaphone,
        planned: true,
      },
    ],
  },
  {
    id: "administration",
    labelKey: "admin.group.administration",
    items: [
      {
        id: "administrators",
        path: "administration/administrators",
        labelKey: "admin.nav.administrators",
        icon: ShieldCheck,
        ownerOnly: true,
      },
      {
        id: "activity",
        path: "administration/activity",
        labelKey: "admin.nav.activity",
        icon: History,
        ownerOnly: true,
      },
      {
        id: "settings",
        path: "administration/settings",
        labelKey: "admin.nav.settings",
        icon: Settings2,
        planned: true,
      },
    ],
  },
];

export const adminNavItems = adminNavGroups.flatMap((group) => group.items);
