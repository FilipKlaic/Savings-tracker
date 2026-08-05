import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthSummary } from "../../types";
import { formatMonthLabel, formatPercent } from "../../lib/format";
import { useTranslation } from "../../lib/i18n";

interface SavingsTrendChartProps {
  summaries: MonthSummary[];
}

export function SavingsTrendChart({ summaries }: SavingsTrendChartProps) {
  const { t, language } = useTranslation();
  const data = summaries
    .slice()
    .reverse()
    .map((s) => ({
      month: formatMonthLabel(s.monthKey, language),
      rate: Math.round(s.savingsRate * 10) / 10,
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-neutral-400">
        {t("history.emptyNone")}
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--gridline)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--baseline)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            formatter={(value) => formatPercent(Number(value))}
            contentStyle={{
              background: "var(--chart-surface)",
              border: "1px solid var(--gridline)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text-primary)",
            }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            name={t("history.chartSeriesName")}
            stroke="var(--series-1)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--series-1)", stroke: "var(--chart-surface)", strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
