import { NAV_ITEMS, type NavKey } from "../lib/nav";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import type { Theme } from "../lib/theme";
import type { Language } from "../lib/language";
import { useTranslation } from "../lib/i18n";

interface SidebarProps {
  active: NavKey;
  onSelect: (key: NavKey) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Sidebar({
  active,
  onSelect,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="mb-6 px-2">
        <h1 className="text-lg font-semibold tracking-tight">{t("nav.appName")}</h1>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          {t("nav.appTagline")}
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
            {t(`nav.${item.key}`)}
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-2">
        <LanguageToggle language={language} onChange={onLanguageChange} />
        <ThemeToggle theme={theme} onChange={onThemeChange} />
      </div>
    </aside>
  );
}
