import { getDb } from "../../lib/db";
import type { Expense, NewExpense } from "../../types";

interface ExpenseRow {
  id: number;
  name: string;
  amount: number;
  recurring: number;
  date: string;
}

function fromRow(row: ExpenseRow): Expense {
  return { ...row, recurring: row.recurring === 1 };
}

export async function listExpenses(): Promise<Expense[]> {
  const db = await getDb();
  const rows = await db.select<ExpenseRow[]>(
    "SELECT id, name, amount, recurring, date FROM expenses ORDER BY date DESC, id DESC",
  );
  return rows.map(fromRow);
}

export async function createExpense(expense: NewExpense): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO expenses (name, amount, recurring, date) VALUES ($1, $2, $3, $4)",
    [expense.name, expense.amount, expense.recurring ? 1 : 0, expense.date],
  );
}

export async function updateExpense(expense: Expense): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE expenses SET name = $1, amount = $2, recurring = $3, date = $4 WHERE id = $5",
    [
      expense.name,
      expense.amount,
      expense.recurring ? 1 : 0,
      expense.date,
      expense.id,
    ],
  );
}

export async function deleteExpense(id: number): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM expenses WHERE id = $1", [id]);
}
