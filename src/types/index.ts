export type IncomeCategory =
  | "salary"
  | "csn"
  | "freelance"
  | "gear_sale"
  | "other";

export const INCOME_CATEGORIES: { value: IncomeCategory; label: string }[] = [
  { value: "salary", label: "Salary" },
  { value: "csn", label: "CSN" },
  { value: "freelance", label: "Freelance" },
  { value: "gear_sale", label: "Gear sale" },
  { value: "other", label: "Other" },
];

export interface IncomeEntry {
  id: number;
  date: string; // ISO yyyy-mm-dd
  source: string;
  category: IncomeCategory;
  amount: number;
}

export type NewIncomeEntry = Omit<IncomeEntry, "id">;

export interface Expense {
  id: number;
  name: string;
  amount: number;
  recurring: boolean;
  date: string; // ISO yyyy-mm-dd
}

export type NewExpense = Omit<Expense, "id">;

export interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  created_date: string; // ISO yyyy-mm-dd
}

export type NewGoal = Omit<Goal, "id" | "current_amount"> & {
  current_amount?: number;
};

export interface GoalContribution {
  id: number;
  goal_id: number;
  amount: number;
  date: string; // ISO yyyy-mm-dd
}

export interface Settings {
  id: 1;
  savings_percentage: number;
}

export interface MonthSummary {
  monthKey: string; // yyyy-mm
  totalIncome: number;
  totalExpenses: number;
  savingsAllocated: number;
  discretionary: number;
  savingsRate: number; // percentage of income actually left after expenses+savings, or savingsAllocated/income
}
