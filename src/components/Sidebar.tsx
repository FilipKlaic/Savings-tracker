import { NAV_ITEMS, type NavKey } from "../lib/nav";
import { ThemeToggle } from "./ThemeToggle";
import type { Theme } from "../lib/theme";

interface SidebarProps {
  active: NavKey;
  onSelect: (key: NavKey) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function Sidebar({ active, onSelect, theme, onThemeChange }: SidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="mb-6 px-2">
        <h1 className="text-lg font-semibold tracking-tight">Savings</h1>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Personal finance tracker
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              active === item.key
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            <span className="w-4 text-center">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <ThemeToggle theme={theme} onChange={onThemeChange} />
    </aside>
  );
}
