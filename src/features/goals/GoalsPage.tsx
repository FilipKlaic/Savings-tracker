import { useEffect, useState } from "react";
import type { Goal, GoalContribution, NewGoal } from "../../types";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { primaryButtonClass } from "../../components/formStyles";
import { currentMonthKey, formatSEK, todayIso } from "../../lib/format";
import { computeMonthSummary } from "../../lib/summary";
import { useTranslation } from "../../lib/i18n";
import { listIncomeEntries } from "../income/api";
import { listExpenses } from "../expenses/api";
import { getSettings } from "../settings/api";
import { GoalForm } from "./GoalForm";
import { GoalCard } from "./GoalCard";
import { ContributeForm } from "./ContributeForm";
import { sumContributionsInMonth } from "./contributions";
import {
  createContribution,
  createGoal,
  deleteGoal,
  listContributions,
  listGoals,
  updateGoal,
} from "./api";

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<GoalContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"add" | Goal | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Goal | null>(null);
  const [contributingGoal, setContributingGoal] = useState<Goal | null>(null);
  const [savingsAllocation, setSavingsAllocation] = useState<number | null>(null);
  const { t } = useTranslation();

  async function refresh() {
    const [goalRows, contributionRows] = await Promise.all([
      listGoals(),
      listContributions(),
    ]);
    setGoals(goalRows);
    setContributions(contributionRows);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    Promise.all([listIncomeEntries(), listExpenses(), getSettings()]).then(
      ([income, expenses, settings]) => {
        const summary = computeMonthSummary(
          currentMonthKey(),
          income,
          expenses,
          settings.savings_percentage,
        );
        setSavingsAllocation(summary.savingsAllocated);
      },
    );
  }, []);

  const contributedThisMonth = sumContributionsInMonth(
    contributions,
    currentMonthKey(),
  );
  const remainingAllocation =
    savingsAllocation === null
      ? null
      : Math.max(0, savingsAllocation - contributedThisMonth);

  async function handleSubmit(goal: NewGoal) {
    if (modalMode && modalMode !== "add") {
      await updateGoal({ ...modalMode, ...goal });
    } else {
      await createGoal(goal);
    }
    setModalMode(null);
    await refresh();
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    await deleteGoal(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  async function handleContribute(amount: number) {
    if (!contributingGoal) return;
    await updateGoal({
      ...contributingGoal,
      current_amount: contributingGoal.current_amount + amount,
    });
    await createContribution(contributingGoal.id, amount, todayIso());
    setContributingGoal(null);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("goals.title")}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("goals.subtitle")}
          </p>
        </div>
        <button className={primaryButtonClass} onClick={() => setModalMode("add")}>
          {t("goals.addButton")}
        </button>
      </div>

      {savingsAllocation !== null && savingsAllocation > 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("goals.allocationText", { amount: formatSEK(savingsAllocation) })}
          {contributedThisMonth > 0 &&
            t("goals.allocationWithContrib", {
              contributed: formatSEK(contributedThisMonth),
              remaining: formatSEK(remainingAllocation ?? 0),
            })}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-neutral-400">{t("common.loading")}</p>
      ) : goals.length === 0 ? (
        <p className="text-sm text-neutral-400">{t("goals.emptyNone")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => setModalMode(goal)}
              onDelete={() => setPendingDelete(goal)}
              onContribute={() => setContributingGoal(goal)}
            />
          ))}
        </div>
      )}

      {modalMode && (
        <Modal
          title={modalMode === "add" ? t("goals.modalCreate") : t("goals.modalEdit")}
          onClose={() => setModalMode(null)}
        >
          <GoalForm
            initial={modalMode === "add" ? undefined : modalMode}
            onSubmit={handleSubmit}
            onCancel={() => setModalMode(null)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={t("goals.deleteTitle")}
          message={t("goals.deleteMessage", { name: pendingDelete.name })}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {contributingGoal && (
        <Modal
          title={t("goals.contributeModalTitle", { name: contributingGoal.name })}
          onClose={() => setContributingGoal(null)}
        >
          <ContributeForm
            goal={contributingGoal}
            suggestedAmount={remainingAllocation}
            onSubmit={handleContribute}
            onCancel={() => setContributingGoal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
