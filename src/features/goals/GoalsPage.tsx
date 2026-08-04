import { useEffect, useState } from "react";
import type { Goal, GoalContribution, NewGoal } from "../../types";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { primaryButtonClass } from "../../components/formStyles";
import { currentMonthKey, formatSEK, todayIso } from "../../lib/format";
import { computeMonthSummary } from "../../lib/summary";
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
      await updateGoal({ ...goal, id: modalMode.id, current_amount: goal.current_amount ?? 0 });
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
          <h1 className="text-2xl font-semibold">Goals</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Save toward the things that matter.
          </p>
        </div>
        <button className={primaryButtonClass} onClick={() => setModalMode("add")}>
          + Add goal
        </button>
      </div>

      {savingsAllocation !== null && savingsAllocation > 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          This month's savings allocation is {formatSEK(savingsAllocation)}
          {contributedThisMonth > 0 && (
            <>
              {" "}
              — {formatSEK(contributedThisMonth)} already contributed to goals,{" "}
              {formatSEK(remainingAllocation ?? 0)} left to assign.
            </>
          )}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : goals.length === 0 ? (
        <p className="text-sm text-neutral-400">No goals yet — create your first one.</p>
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
          title={modalMode === "add" ? "Create goal" : "Edit goal"}
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
          title="Delete goal"
          message={`Delete "${pendingDelete.name}"? This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {contributingGoal && (
        <Modal
          title={`Contribute to ${contributingGoal.name}`}
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
