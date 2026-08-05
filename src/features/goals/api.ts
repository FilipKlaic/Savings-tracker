import { getDb } from "../../lib/db";
import type { Goal, GoalContribution, NewGoal } from "../../types";

export async function listGoals(): Promise<Goal[]> {
  const db = await getDb();
  return db.select<Goal[]>(
    `SELECT g.id, g.name, g.target_amount, g.created_date,
            COALESCE(SUM(c.amount), 0) AS current_amount
     FROM goals g
     LEFT JOIN goal_contributions c ON c.goal_id = g.id
     GROUP BY g.id
     ORDER BY g.created_date DESC, g.id DESC`,
  );
}

export async function createGoal(goal: NewGoal): Promise<void> {
  const db = await getDb();
  const result = await db.execute(
    "INSERT INTO goals (name, target_amount, current_amount, created_date) VALUES ($1, $2, 0, $3)",
    [goal.name, goal.target_amount, goal.created_date],
  );
  const startingAmount = goal.current_amount ?? 0;
  if (startingAmount > 0 && result.lastInsertId) {
    await db.execute(
      "INSERT INTO goal_contributions (goal_id, amount, date) VALUES ($1, $2, $3)",
      [result.lastInsertId, startingAmount, goal.created_date],
    );
  }
}

export async function updateGoal(goal: Goal): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE goals SET name = $1, target_amount = $2, created_date = $3 WHERE id = $4",
    [goal.name, goal.target_amount, goal.created_date, goal.id],
  );
}

export async function deleteGoal(id: number): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM goals WHERE id = $1", [id]);
}

export async function listContributions(): Promise<GoalContribution[]> {
  const db = await getDb();
  return db.select<GoalContribution[]>(
    "SELECT id, goal_id, amount, date FROM goal_contributions ORDER BY date DESC, id DESC",
  );
}

export async function createContribution(
  goalId: number,
  amount: number,
  date: string,
): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO goal_contributions (goal_id, amount, date) VALUES ($1, $2, $3)",
    [goalId, amount, date],
  );
}
