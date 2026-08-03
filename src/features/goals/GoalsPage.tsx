import { useEffect, useState } from "react";
import type { Goal, NewGoal } from "../../types";
import { Modal } from "../../components/Modal";
import { primaryButtonClass } from "../../components/formStyles";
import { GoalForm } from "./GoalForm";
import { GoalCard } from "./GoalCard";
import { createGoal, deleteGoal, listGoals, updateGoal } from "./api";

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"add" | Goal | null>(null);

  async function refresh() {
    setGoals(await listGoals());
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(goal: NewGoal) {
    if (modalMode && modalMode !== "add") {
      await updateGoal({ ...goal, id: modalMode.id, current_amount: goal.current_amount ?? 0 });
    } else {
      await createGoal(goal);
    }
    setModalMode(null);
    await refresh();
  }

  async function handleDelete(id: number) {
    await deleteGoal(id);
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
              onDelete={() => handleDelete(goal.id)}
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
    </div>
  );
}
