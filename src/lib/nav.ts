export type NavKey =
  | "dashboard"
  | "income"
  | "expenses"
  | "goals"
  | "history"
  | "settings";

export const NAV_ITEMS: { key: NavKey; label: string; icon: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "◧" },
  { key: "income", label: "Income", icon: "↑" },
  { key: "expenses", label: "Expenses", icon: "↓" },
  { key: "goals", label: "Goals", icon: "◎" },
  { key: "history", label: "History", icon: "⏱" },
  { key: "settings", label: "Settings", icon: "⚙" },
];
