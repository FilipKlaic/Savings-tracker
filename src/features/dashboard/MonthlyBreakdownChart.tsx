import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatSEK } from "../../lib/format";

interface MonthlyBreakdownChartProps {
  savings: number;
  expenses: number;
  discretionary: number;
}

export function MonthlyBreakdownChart({
  savings,
  expenses,
  discretionary,
}: MonthlyBreakdownChartProps) {
  const data = [
    { name: "Savings", value: Math.max(savings, 0), color: "var(--series-1)" },
    { name: "Expenses", value: Math.max(expenses, 0), color: "var(--series-2)" },
    {
      name: "Discretionary",
      value: Math.max(discretionary, 0),
      color: "var(--series-3)",
    },
  ];

  const isEmpty = data.every((d) => d.value === 0);

  return (
    <div className="h-64 w-full">
      {isEmpty ? (
        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
          No data for this month yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
              cornerRadius={4}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatSEK(Number(value))}
              contentStyle={{
                background: "var(--chart-surface)",
                border: "1px solid var(--gridline)",
                borderRadius: 8,
                fontSize: 13,
                color: "var(--text-primary)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={32}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
