import type { Expense } from "../../types";
import { currentMonthKey, monthKeyOf, todayIso } from "../../lib/format";

export function getCarryOverCandidates(expenses: Expense[]): Expense[] {
  const current = currentMonthKey();

  const latestByName = new Map<string, Expense>();
  for (const expense of expenses) {
    if (!expense.recurring) continue;
    const existing = latestByName.get(expense.name);
    if (!existing || expense.date > existing.date) {
      latestByName.set(expense.name, expense);
    }
  }

  const namesInCurrentMonth = new Set(
    expenses
      .filter((expense) => monthKeyOf(expense.date) === current)
      .map((expense) => expense.name),
  );

  return Array.from(latestByName.values()).filter(
    (expense) =>
      monthKeyOf(expense.date) !== current &&
      !namesInCurrentMonth.has(expense.name),
  );
}

export function toCarryOverInput(expense: Expense) {
  return {
    name: expense.name,
    amount: expense.amount,
    recurring: expense.recurring,
    date: todayIso(),
  };
}
