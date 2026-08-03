import { getDb } from "../../lib/db";
import type { IncomeEntry, NewIncomeEntry } from "../../types";

export async function listIncomeEntries(): Promise<IncomeEntry[]> {
  const db = await getDb();
  return db.select<IncomeEntry[]>(
    "SELECT id, date, source, category, amount FROM income_entries ORDER BY date DESC, id DESC",
  );
}

export async function createIncomeEntry(entry: NewIncomeEntry): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO income_entries (date, source, category, amount) VALUES ($1, $2, $3, $4)",
    [entry.date, entry.source, entry.category, entry.amount],
  );
}

export async function updateIncomeEntry(entry: IncomeEntry): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE income_entries SET date = $1, source = $2, category = $3, amount = $4 WHERE id = $5",
    [entry.date, entry.source, entry.category, entry.amount, entry.id],
  );
}

export async function deleteIncomeEntry(id: number): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM income_entries WHERE id = $1", [id]);
}
