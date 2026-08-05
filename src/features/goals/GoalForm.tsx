import { useState } from "react";
import type { FormEvent } from "react";
import type { Goal, NewGoal } from "../../types";
import { formatSEK, todayIso } from "../../lib/format";
import { useTranslation } from "../../lib/i18n";
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
  const [startingAmount, setStartingAmount] = useState("0");
  const [createdDate] = useState(initial?.created_date ?? todayIso());
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedTarget = Number(targetAmount);
    const parsedStarting = Number(startingAmount);
    if (!name.trim() || !Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        target_amount: parsedTarget,
        created_date: createdDate,
        ...(initial
          ? {}
          : { current_amount: Number.isFinite(parsedStarting) ? parsedStarting : 0 }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>{t("goals.formName")}</label>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("goals.formNamePlaceholder")}
          autoFocus
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t("goals.formTargetAmount")}</label>
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
          {initial ? (
            <>
              <label className={labelClass}>{t("goals.formCurrentProgress")}</label>
              <p className={`${inputClass} flex items-center bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400`}>
                {formatSEK(initial.current_amount)}
              </p>
            </>
          ) : (
            <>
              <label className={labelClass}>{t("goals.formStartingAmount")}</label>
              <input
                className={inputClass}
                type="number"
                min="0"
                step="1"
                value={startingAmount}
                onChange={(e) => setStartingAmount(e.target.value)}
                placeholder="0"
              />
            </>
          )}
        </div>
      </div>

      {initial && (
        <p className="-mt-2 text-xs text-neutral-400">
          {t("goals.formCurrentProgressNote")}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className={secondaryButtonClass} onClick={onCancel}>
          {t("common.cancel")}
        </button>
        <button type="submit" className={primaryButtonClass} disabled={saving}>
          {initial ? t("goals.formSubmitSave") : t("goals.formSubmitCreate")}
        </button>
      </div>
    </form>
  );
}
