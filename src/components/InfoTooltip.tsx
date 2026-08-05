import { useTranslation } from "../lib/i18n";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const { t } = useTranslation();
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={t("common.moreInfo")}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-neutral-300 text-[10px] leading-none text-neutral-400 outline-none transition hover:border-neutral-400 hover:text-neutral-600 focus-visible:border-neutral-400 focus-visible:text-neutral-600 dark:border-neutral-600 dark:text-neutral-500 dark:hover:border-neutral-500 dark:hover:text-neutral-300 dark:focus-visible:border-neutral-500 dark:focus-visible:text-neutral-300"
      >
        i
      </button>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-52 -translate-x-1/2 rounded-lg border border-neutral-200 bg-white p-2.5 text-xs leading-relaxed text-neutral-600 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
        {text}
      </span>
    </span>
  );
}
