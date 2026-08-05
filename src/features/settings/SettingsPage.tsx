import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { primaryButtonClass } from "../../components/formStyles";
import { useTranslation } from "../../lib/i18n";
import { getSettings, updateSavingsPercentage } from "./api";

export function SettingsPage() {
  const [percentage, setPercentage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();

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
        <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("settings.subtitle")}
        </p>
      </div>

      <Card title={t("settings.cardTitle")} className="max-w-lg">
        {loading ? (
          <p className="text-sm text-neutral-400">{t("common.loading")}</p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("settings.description")}
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
                {t("settings.save")}
              </button>
              {saved && (
                <span className="text-sm text-emerald-500">{t("settings.saved")}</span>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
