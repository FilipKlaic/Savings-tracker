import type { Expense, IncomeEntry, MonthSummary } from "../types";
import { monthKeyOf } from "./format";

export function computeMonthSummary(
  monthKey: string,
  incomeEntries: IncomeEntry[],
  expenses: Expense[],
  savingsPercentage: number,
): MonthSummary {
  const totalIncome = incomeEntries
    .filter((entry) => monthKeyOf(entry.date) === monthKey)
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = expenses
    .filter((expense) => monthKeyOf(expense.date) === monthKey)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const savingsAllocated = totalIncome * (savingsPercentage / 100);
  const discretionary = totalIncome - totalExpenses - savingsAllocated;
  const savingsRate = totalIncome > 0 ? (savingsAllocated / totalIncome) * 100 : 0;

  return {
    monthKey,
    totalIncome,
    totalExpenses,
    savingsAllocated,
    discretionary,
    savingsRate,
  };
}

export function listMonthKeys(
  incomeEntries: IncomeEntry[],
  expenses: Expense[],
): string[] {
  const keys = new Set<string>();
  incomeEntries.forEach((entry) => keys.add(monthKeyOf(entry.date)));
  expenses.forEach((expense) => keys.add(monthKeyOf(expense.date)));
  return Array.from(keys).sort((a, b) => b.localeCompare(a));
}
