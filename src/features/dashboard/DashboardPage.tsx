import { useEffect, useState } from "react";
import type { Expense, GoalContribution, IncomeEntry, Settings } from "../../types";
import { Card } from "../../components/Card";
import { StatTile } from "../../components/StatTile";
import { currentMonthKey, formatMonthLabel, formatSEK } from "../../lib/format";
import { computeMonthSummary } from "../../lib/summary";
import { useTranslation } from "../../lib/i18n";
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
  const { t, language } = useTranslation();

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
        <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("dashboard.subtitle", { month: formatMonthLabel(monthKey, language) })}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">{t("common.loading")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label={t("dashboard.totalIncome")}
              value={formatSEK(summary.totalIncome)}
              info={t("dashboard.totalIncomeInfo")}
            />
            <StatTile
              label={t("dashboard.totalExpenses")}
              value={formatSEK(summary.totalExpenses)}
              accent="series-2"
              info={t("dashboard.totalExpensesInfo")}
            />
            <StatTile
              label={t("dashboard.allocatedToSavings")}
              value={formatSEK(summary.savingsAllocated)}
              accent="series-1"
              info={t("dashboard.allocatedToSavingsInfo")}
              sublabel={
                contributedThisMonth > 0
                  ? t("dashboard.movedToGoals", {
                      amount: formatSEK(contributedThisMonth),
                    })
                  : undefined
              }
            />
            <StatTile
              label={t("dashboard.discretionaryLeft")}
              value={formatSEK(summary.discretionary)}
              accent="series-3"
              info={t("dashboard.discretionaryLeftInfo")}
            />
          </div>

          <Card title={t("dashboard.breakdownTitle")}>
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
