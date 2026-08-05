import type { Theme } from "../lib/theme";
import { useTranslation } from "../lib/i18n";

const OPTIONS: { value: Theme; labelKey: string; icon: string }[] = [
  { value: "light", labelKey: "theme.light", icon: "☀" },
  { value: "system", labelKey: "theme.system", icon: "◐" },
  { value: "dark", labelKey: "theme.dark", icon: "☾" },
];

interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          title={t(option.labelKey)}
          className={`flex-1 rounded-md px-2 py-1.5 text-sm transition ${
            theme === option.value
              ? "bg-white shadow-sm dark:bg-neutral-700"
              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          }`}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
