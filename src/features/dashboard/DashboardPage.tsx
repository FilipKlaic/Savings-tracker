import { useEffect, useState } from "react";
import type { Expense, GoalContribution, IncomeEntry, Settings } from "../../types";
import { Card } from "../../components/Card";
import { StatTile } from "../../components/StatTile";
import { currentMonthKey, formatMonthLabel, formatSEK } from "../../lib/format";
import { computeMonthSummary } from "../../lib/summary";
import { listIncomeEntries } from "../income/api";
import { listExpenses } from "../expenses/api";
import { getSettings } from "../settings/api";
import { listContributions } from "../goals/api";
import { sumContributionsInMonth } from "../goals/contributions";
import { MonthlyBreakdownChart } from "./MonthlyBreakdownChart";

export function DashboardPage() {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [contributions, setContributions] = useState<GoalContribution[]>([]);
  const [settings, setSettings] = useState<Settings>({ id: 1, savings_percentage: 20 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listIncomeEntries(),
      listExpenses(),
      getSettings(),
      listContributions(),
    ])
      .then(([income, expense, settingsData, contributionRows]) => {
        setIncomeEntries(income);
        setExpenses(expense);
        setSettings(settingsData);
        setContributions(contributionRows);
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
  const contributedThisMonth = sumContributionsInMonth(contributions, monthKey);

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
              sublabel={
                contributedThisMonth > 0
                  ? `${formatSEK(contributedThisMonth)} moved to goals`
                  : undefined
              }
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
