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

const monthLabelFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return monthLabelFormatter.format(new Date(year, month - 1, 1));
}
