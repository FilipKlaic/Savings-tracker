import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { primaryButtonClass } from "../../components/formStyles";
import { getSettings, updateSavingsPercentage } from "./api";

export function SettingsPage() {
  const [percentage, setPercentage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings()
      .then((settings) => setPercentage(settings.savings_percentage))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    await updateSavingsPercentage(percentage);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure how your income is automatically allocated.
        </p>
      </div>

      <Card title="Savings rule" className="max-w-lg">
        {loading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Automatically set aside this percentage of every krona of income
              toward savings, before discretionary spending.
            </p>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="h-2 flex-1 cursor-pointer accent-neutral-900 dark:accent-neutral-100"
              />
              <span className="w-16 text-right text-xl font-semibold tabular-nums">
                {percentage}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className={primaryButtonClass} onClick={handleSave}>
                Save
              </button>
              {saved && (
                <span className="text-sm text-emerald-500">Saved ✓</span>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
