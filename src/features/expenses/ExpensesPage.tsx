import { useEffect, useState } from "react";
import type { Expense, NewExpense } from "../../types";
import { Card } from "../../components/Card";
import { Modal } from "../../components/Modal";
import { primaryButtonClass, dangerTextClass } from "../../components/formStyles";
import { formatSEK } from "../../lib/format";
import { ExpenseForm } from "./ExpenseForm";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
} from "./api";

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"add" | Expense | null>(null);

  async function refresh() {
    setExpenses(await listExpenses());
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(expense: NewExpense) {
    if (modalMode && modalMode !== "add") {
      await updateExpense({ ...expense, id: modalMode.id });
    } else {
      await createExpense(expense);
    }
    setModalMode(null);
    await refresh();
  }

  async function handleDelete(id: number) {
    await deleteExpense(id);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Keep track of fixed and one-time costs.
          </p>
        </div>
        <button className={primaryButtonClass} onClick={() => setModalMode("add")}>
          + Add expense
        </button>
      </div>

      <Card>
        {loading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : expenses.length === 0 ? (
          <p className="text-sm text-neutral-400">No expenses recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-400 dark:border-neutral-800">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 text-right font-medium">Amount</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60"
                >
                  <td className="py-2.5 text-neutral-500 dark:text-neutral-400">
                    {expense.date}
                  </td>
                  <td className="py-2.5 font-medium">{expense.name}</td>
                  <td className="py-2.5">
                    {expense.recurring ? (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                        Recurring
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                        One-time
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-right font-medium tabular-nums">
                    {formatSEK(expense.amount)}
                  </td>
                  <td className="py-2.5 pl-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-sm text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        onClick={() => setModalMode(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className={dangerTextClass}
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {modalMode && (
        <Modal
          title={modalMode === "add" ? "Add expense" : "Edit expense"}
          onClose={() => setModalMode(null)}
        >
          <ExpenseForm
            initial={modalMode === "add" ? undefined : modalMode}
            onSubmit={handleSubmit}
            onCancel={() => setModalMode(null)}
          />
        </Modal>
      )}
    </div>
  );
}
