import { useState } from "react";
import type { FormEvent } from "react";
import type { Expense, NewExpense } from "../../types";
import { todayIso } from "../../lib/format";
import { useTranslation } from "../../lib/i18n";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../components/formStyles";

interface ExpenseFormProps {
  initial?: Expense;
  onSubmit: (expense: NewExpense) => Promise<void>;
  onCancel: () => void;
}

export function ExpenseForm({ initial, onSubmit, onCancel }: ExpenseFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [recurring, setRecurring] = useState(initial?.recurring ?? true);
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!name.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), amount: parsedAmount, recurring, date });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>{t("expenses.formName")}</label>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("expenses.formNamePlaceholder")}
          autoFocus
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t("expenses.formAmount")}</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
          />
        </div>
        <div>
          <label className={labelClass}>{t("expenses.formDate")}</label>
          <input
            className={inputClass}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600"
        />
        {t("expenses.formRecurringLabel")}
      </label>

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className={secondaryButtonClass} onClick={onCancel}>
          {t("common.cancel")}
        </button>
        <button type="submit" className={primaryButtonClass} disabled={saving}>
          {initial ? t("expenses.formSubmitSave") : t("expenses.formSubmitAdd")}
        </button>
      </div>
    </form>
  );
}
