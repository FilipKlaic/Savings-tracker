import { getDb } from "../../lib/db";
import type { Settings } from "../../types";

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const rows = await db.select<Settings[]>(
    "SELECT id, savings_percentage FROM settings WHERE id = 1",
  );
  return rows[0] ?? { id: 1, savings_percentage: 20 };
}

export async function updateSavingsPercentage(percentage: number): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE settings SET savings_percentage = $1 WHERE id = 1",
    [percentage],
  );
}
