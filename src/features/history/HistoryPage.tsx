import { useEffect, useState } from "react";
import type { Expense, IncomeEntry, MonthSummary, Settings } from "../../types";
import { Card } from "../../components/Card";
import { formatMonthLabel, formatPercent, formatSEK } from "../../lib/format";
import { computeMonthSummary, listMonthKeys } from "../../lib/summary";
import { useTranslation } from "../../lib/i18n";
import { listIncomeEntries } from "../income/api";
import { listExpenses } from "../expenses/api";
import { getSettings } from "../settings/api";
import { SavingsTrendChart } from "./SavingsTrendChart";

export function HistoryPage() {
  const [summaries, setSummaries] = useState<MonthSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

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
        <h1 className="text-2xl font-semibold">{t("history.title")}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("history.subtitle")}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">{t("common.loading")}</p>
      ) : (
        <>
          <Card title={t("history.trendTitle")}>
            <SavingsTrendChart summaries={summaries} />
          </Card>

          <Card>
            {summaries.length === 0 ? (
              <p className="text-sm text-neutral-400">{t("history.emptyNone")}</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-400 dark:border-neutral-800">
                    <th className="pb-2 font-medium">{t("history.colMonth")}</th>
                    <th className="pb-2 text-right font-medium">{t("history.colIncome")}</th>
                    <th className="pb-2 text-right font-medium">{t("history.colExpenses")}</th>
                    <th className="pb-2 text-right font-medium">{t("history.colSavings")}</th>
                    <th className="pb-2 text-right font-medium">{t("history.colDiscretionary")}</th>
                    <th className="pb-2 text-right font-medium">{t("history.colRate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((summary) => (
                    <tr
                      key={summary.monthKey}
                      className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60"
                    >
                      <td className="py-2.5 font-medium">
                        {formatMonthLabel(summary.monthKey, language)}
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
