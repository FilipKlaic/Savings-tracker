import { useState } from "react";
import type { FormEvent } from "react";
import type { Goal, NewGoal } from "../../types";
import { todayIso } from "../../lib/format";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../components/formStyles";

interface GoalFormProps {
  initial?: Goal;
  onSubmit: (goal: NewGoal) => Promise<void>;
  onCancel: () => void;
}

export function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(
    initial ? String(initial.target_amount) : "",
  );
  const [currentAmount, setCurrentAmount] = useState(
    initial ? String(initial.current_amount) : "0",
  );
  const [createdDate] = useState(initial?.created_date ?? todayIso());
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedTarget = Number(targetAmount);
    const parsedCurrent = Number(currentAmount);
    if (!name.trim() || !Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        target_amount: parsedTarget,
        current_amount: Number.isFinite(parsedCurrent) ? parsedCurrent : 0,
        created_date: createdDate,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Goal name</label>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. New camera lens"
          autoFocus
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Target amount (kr)</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="1"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Current progress (kr)</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="1"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className={secondaryButtonClass} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={primaryButtonClass} disabled={saving}>
          {initial ? "Save changes" : "Create goal"}
        </button>
      </div>
    </form>
  );
}
