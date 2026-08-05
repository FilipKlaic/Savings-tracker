import { LOCALE_BY_LANGUAGE, type Language } from "./language";

const sekFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

export function formatSEK(amount: number): string {
  return sekFormatter.format(amount);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthKeyOf(dateIso: string): string {
  return dateIso.slice(0, 7);
}

export function currentMonthKey(): string {
  return monthKeyOf(todayIso());
}

const monthLabelFormatters: Record<Language, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE.en, {
    month: "short",
    year: "numeric",
  }),
  sv: new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE.sv, {
    month: "short",
    year: "numeric",
  }),
};

export function formatMonthLabel(monthKey: string, language: Language = "en"): string {
  const [year, month] = monthKey.split("-").map(Number);
  return monthLabelFormatters[language].format(new Date(year, month - 1, 1));
}
