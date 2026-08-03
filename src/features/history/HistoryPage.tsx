import { useEffect, useState } from "react";
import type { Expense, IncomeEntry, MonthSummary, Settings } from "../../types";
import { Card } from "../../components/Card";
import { formatMonthLabel, formatPercent, formatSEK } from "../../lib/format";
import { computeMonthSummary, listMonthKeys } from "../../lib/summary";
import { listIncomeEntries } from "../income/api";
import { listExpenses } from "../expenses/api";
import { getSettings } from "../settings/api";
import { SavingsTrendChart } from "./SavingsTrendChart";

export function HistoryPage() {
  const [summaries, setSummaries] = useState<MonthSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listIncomeEntries(), listExpenses(), getSettings()]).then(
      ([income, expenses, settings]: [IncomeEntry[], Expense[], Settings]) => {
        const months = listMonthKeys(income, expenses);
        setSummaries(
          months.map((month) =>
            computeMonthSummary(month, income, expenses, settings.savings_percentage),
          ),
        );
        setLoading(false);
      },
    );
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          How your savings rate has moved over time.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : (
        <>
          <Card title="Savings rate trend">
            <SavingsTrendChart summaries={summaries} />
          </Card>

          <Card>
            {summaries.length === 0 ? (
              <p className="text-sm text-neutral-400">No history yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-400 dark:border-neutral-800">
                    <th className="pb-2 font-medium">Month</th>
                    <th className="pb-2 text-right font-medium">Income</th>
                    <th className="pb-2 text-right font-medium">Expenses</th>
                    <th className="pb-2 text-right font-medium">Savings</th>
                    <th className="pb-2 text-right font-medium">Discretionary</th>
                    <th className="pb-2 text-right font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((summary) => (
                    <tr
                      key={summary.monthKey}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60"
                    >
                      <td className="py-2.5 font-medium">
                        {formatMonthLabel(summary.monthKey)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatSEK(summary.totalIncome)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatSEK(summary.totalExpenses)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatSEK(summary.savingsAllocated)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatSEK(summary.discretionary)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-neutral-500 dark:text-neutral-400">
                        {formatPercent(summary.savingsRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
