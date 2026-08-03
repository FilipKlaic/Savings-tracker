import { getDb } from "../../lib/db";
import type { Goal, NewGoal } from "../../types";

export async function listGoals(): Promise<Goal[]> {
  const db = await getDb();
  return db.select<Goal[]>(
    "SELECT id, name, target_amount, current_amount, created_date FROM goals ORDER BY created_date DESC, id DESC",
  );
}

export async function createGoal(goal: NewGoal): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO goals (name, target_amount, current_amount, created_date) VALUES ($1, $2, $3, $4)",
    [goal.name, goal.target_amount, goal.current_amount ?? 0, goal.created_date],
  );
}

export async function updateGoal(goal: Goal): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE goals SET name = $1, target_amount = $2, current_amount = $3, created_date = $4 WHERE id = $5",
    [goal.name, goal.target_amount, goal.current_amount, goal.created_date, goal.id],
  );
}

export async function deleteGoal(id: number): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM goals WHERE id = $1", [id]);
}
