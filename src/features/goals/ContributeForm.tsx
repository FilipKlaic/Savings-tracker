import { useState } from "react";
import type { FormEvent } from "react";
import type { Goal } from "../../types";
import { formatSEK } from "../../lib/format";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../components/formStyles";

interface ContributeFormProps {
  goal: Goal;
  suggestedAmount: number | null;
  onSubmit: (amount: number) => Promise<void>;
  onCancel: () => void;
}

export function ContributeForm({
  goal,
  suggestedAmount,
  onSubmit,
  onCancel,
}: ContributeFormProps) {
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
    setSaving(true);
    try {
      await onSubmit(parsedAmount);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Currently{" "}
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          {formatSEK(goal.current_amount)}
        </span>{" "}
        of {formatSEK(goal.target_amount)}.
      </p>

      <div>
        <label className={labelClass}>Amount to add (kr)</label>
        <input
          className={inputClass}
          type="number"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          autoFocus
          required
        />
        {suggestedAmount !== null && suggestedAmount > 0 && (
          <button
            type="button"
            className="mt-2 text-xs text-neutral-500 underline decoration-dotted hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            onClick={() => setAmount(String(suggestedAmount))}
          >
            Use remaining savings allocation ({formatSEK(suggestedAmount)})
          </button>
        )}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className={secondaryButtonClass} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={primaryButtonClass} disabled={saving}>
          Add to goal
        </button>
      </div>
    </form>
  );
}
