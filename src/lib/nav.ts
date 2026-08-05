export type NavKey =
  | "dashboard"
  | "income"
  | "expenses"
  | "goals"
  | "history"
  | "settings";

export const NAV_ITEMS: { key: NavKey; icon: string }[] = [
  { key: "dashboard", icon: "◧" },
  { key: "income", icon: "↑" },
  { key: "expenses", icon: "↓" },
  { key: "goals", icon: "◎" },
  { key: "history", icon: "⏱" },
  { key: "settings", icon: "⚙" },
];
