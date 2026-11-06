import {
  BookOpen,
  Library,
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type MemberNavItem =
  | { kind: "link"; path: string; key: string; icon: LucideIcon }
  | { kind: "cart"; key: string; icon: LucideIcon };

/** Member area navigation, grouped as Main / Learning / Purchases / Account. */
export const memberNav: { group: string; items: MemberNavItem[] }[] = [
  {
    group: "member.group.main",
    items: [{ kind: "link", path: "dashboard", key: "member.nav.dashboard", icon: LayoutDashboard }],
  },
  {
    group: "member.group.learning",
    items: [
      { kind: "link", path: "my-courses", key: "member.nav.courses", icon: BookOpen },
      { kind: "link", path: "my-library", key: "member.nav.library", icon: Library },
    ],
  },
  {
    group: "member.group.purchases",
    items: [
      { kind: "link", path: "my-orders", key: "member.nav.orders", icon: Receipt },
      { kind: "cart", key: "member.nav.cart", icon: ShoppingCart },
    ],
  },
  {
    group: "member.group.account",
    items: [{ kind: "link", path: "account", key: "member.nav.account", icon: UserRound }],
  },
];
