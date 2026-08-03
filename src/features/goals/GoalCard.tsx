import type { Goal } from "../../types";
import { Card } from "../../components/Card";
import { dangerTextClass } from "../../components/formStyles";
import { formatSEK } from "../../lib/format";

interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = goal.target_amount > 0
    ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
    : 0;
  const complete = progress >= 100;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{goal.name}</h3>
          <p className="text-xs text-neutral-400">
            Started {goal.created_date}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="text-sm text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            onClick={onEdit}
          >
            Edit
          </button>
          <button className={dangerTextClass} onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="font-medium tabular-nums">
            {formatSEK(goal.current_amount)}
          </span>
          <span className="text-neutral-400">
            of {formatSEK(goal.target_amount)}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div
            className={`h-full rounded-full transition-all ${
              complete ? "" : "bg-neutral-900 dark:bg-neutral-100"
            }`}
            style={{
              width: `${progress}%`,
              backgroundColor: complete ? "var(--status-good)" : undefined,
            }}
          />
        </div>
        <p className="mt-1.5 text-xs text-neutral-400">
          {complete ? "Goal reached" : `${Math.round(progress)}% funded`}
        </p>
      </div>
    </Card>
  );
}
