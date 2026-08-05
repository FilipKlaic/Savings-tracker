import { useState } from "react";
import type { FormEvent } from "react";
import type { IncomeCategory, IncomeEntry, NewIncomeEntry } from "../../types";
import { INCOME_CATEGORY_VALUES } from "../../types";
import { todayIso } from "../../lib/format";
import { useTranslation } from "../../lib/i18n";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../components/formStyles";

interface IncomeFormProps {
  initial?: IncomeEntry;
  onSubmit: (entry: NewIncomeEntry) => Promise<void>;
  onCancel: () => void;
}

export function IncomeForm({ initial, onSubmit, onCancel }: IncomeFormProps) {
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [source, setSource] = useState(initial?.source ?? "");
  const [category, setCategory] = useState<IncomeCategory>(
    initial?.category ?? "salary",
  );
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!source.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ date, source: source.trim(), category, amount: parsedAmount });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>{t("income.formSource")}</label>
        <input
          className={inputClass}
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder={t("income.formSourcePlaceholder")}
          autoFocus
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t("income.formCategory")}</label>
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as IncomeCategory)}
          >
            {INCOME_CATEGORY_VALUES.map((value) => (
              <option key={value} value={value}>
                {t(`income.categories.${value}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t("income.formAmount")}</label>
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
      </div>

      <div>
        <label className={labelClass}>{t("income.formDate")}</label>
        <input
          className={inputClass}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className={secondaryButtonClass} onClick={onCancel}>
          {t("common.cancel")}
        </button>
        <button type="submit" className={primaryButtonClass} disabled={saving}>
          {initial ? t("income.formSubmitSave") : t("income.formSubmitAdd")}
        </button>
      </div>
    </form>
  );
}
