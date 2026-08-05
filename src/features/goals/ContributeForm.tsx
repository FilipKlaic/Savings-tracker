import { useState } from "react";
import type { FormEvent } from "react";
import type { Goal } from "../../types";
import { formatSEK } from "../../lib/format";
import { useTranslation } from "../../lib/i18n";
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
  const { t } = useTranslation();

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
        {t("goals.contributeCurrently", {
          current: formatSEK(goal.current_amount),
          target: formatSEK(goal.target_amount),
        })}
      </p>

      <div>
        <label className={labelClass}>{t("goals.contributeAmountLabel")}</label>
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
            {t("goals.contributeSuggestion", { amount: formatSEK(suggestedAmount) })}
          </button>
        )}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className={secondaryButtonClass} onClick={onCancel}>
          {t("common.cancel")}
        </button>
        <button type="submit" className={primaryButtonClass} disabled={saving}>
          {t("goals.contributeSubmit")}
        </button>
      </div>
    </form>
  );
}
