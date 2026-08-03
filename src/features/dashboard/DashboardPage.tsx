import { useEffect, useState } from "react";
import type { Expense, IncomeEntry, Settings } from "../../types";
import { Card } from "../../components/Card";
import { StatTile } from "../../components/StatTile";
import { currentMonthKey, formatMonthLabel, formatSEK } from "../../lib/format";
import { computeMonthSummary } from "../../lib/summary";
import { listIncomeEntries } from "../income/api";
import { listExpenses } from "../expenses/api";
import { getSettings } from "../settings/api";
import { MonthlyBreakdownChart } from "./MonthlyBreakdownChart";

export function DashboardPage() {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings>({ id: 1, savings_percentage: 20 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listIncomeEntries(), listExpenses(), getSettings()])
      .then(([income, expense, settingsData]) => {
        setIncomeEntries(income);
        setExpenses(expense);
        setSettings(settingsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const monthKey = currentMonthKey();
  const summary = computeMonthSummary(
    monthKey,
    incomeEntries,
    expenses,
    settings.savings_percentage,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Overview for {formatMonthLabel(monthKey)}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Total income" value={formatSEK(summary.totalIncome)} />
            <StatTile
              label="Total expenses"
              value={formatSEK(summary.totalExpenses)}
              accent="series-2"
            />
            <StatTile
              label="Allocated to savings"
              value={formatSEK(summary.savingsAllocated)}
              accent="series-1"
            />
            <StatTile
              label="Discretionary left"
              value={formatSEK(summary.discretionary)}
              accent="series-3"
            />
          </div>

          <Card title="This month's breakdown">
            <MonthlyBreakdownChart
              savings={summary.savingsAllocated}
              expenses={summary.totalExpenses}
              discretionary={summary.discretionary}
            />
          </Card>
        </>
      )}
    </div>
  );
}
