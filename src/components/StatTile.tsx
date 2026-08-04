import { Card } from "./Card";

interface StatTileProps {
  label: string;
  value: string;
  accent?: "series-1" | "series-2" | "series-3";
  sublabel?: string;
}

const accentDot: Record<string, string> = {
  "series-1": "var(--series-1)",
  "series-2": "var(--series-2)",
  "series-3": "var(--series-3)",
};

export function StatTile({ label, value, accent, sublabel }: StatTileProps) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        {accent && (
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accentDot[accent] }}
          />
        )}
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {sublabel && (
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          {sublabel}
        </p>
      )}
    </Card>
  );
}
