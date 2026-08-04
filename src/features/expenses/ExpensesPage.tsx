import { useEffect, useMemo, useState } from "react";
import type { Expense, NewExpense } from "../../types";
import { Card } from "../../components/Card";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import {
  primaryButtonClass,
  secondaryButtonClass,
  dangerTextClass,
  inputClass,
} from "../../components/formStyles";
import { formatMonthLabel, formatSEK, monthKeyOf } from "../../lib/format";
import { ExpenseForm } from "./ExpenseForm";
import { getCarryOverCandidates, toCarryOverInput } from "./carryOver";
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
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);
  const [monthFilter, setMonthFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [carryingOver, setCarryingOver] = useState(false);

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

  async function handleDelete() {
    if (!pendingDelete) return;
    await deleteExpense(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  const carryOverCandidates = useMemo(
    () => getCarryOverCandidates(expenses),
    [expenses],
  );

  async function handleCarryOverAll() {
    setCarryingOver(true);
    try {
      for (const candidate of carryOverCandidates) {
        await createExpense(toCarryOverInput(candidate));
      }
      await refresh();
    } finally {
      setCarryingOver(false);
    }
  }

  const months = useMemo(
    () =>
      Array.from(new Set(expenses.map((e) => monthKeyOf(e.date)))).sort((a, b) =>
        b.localeCompare(a),
      ),
    [expenses],
  );

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return expenses.filter((expense) => {
      if (monthFilter !== "all" && monthKeyOf(expense.date) !== monthFilter) {
        return false;
      }
      if (query && !expense.name.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  }, [expenses, monthFilter, search]);

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

      {carryOverCandidates.length > 0 && (
        <Card className="border-neutral-300 dark:border-neutral-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              You have {carryOverCandidates.length} recurring expense
              {carryOverCandidates.length === 1 ? "" : "s"} not yet added this
              month:{" "}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {carryOverCandidates.map((c) => c.name).join(", ")}
              </span>
            </p>
            <button
              className={secondaryButtonClass}
              onClick={handleCarryOverAll}
              disabled={carryingOver}
            >
              Add to this month
            </button>
          </div>
        </Card>
      )}

      {expenses.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <input
            className={`${inputClass} max-w-xs`}
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={`${inputClass} w-auto`}
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="all">All time</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </select>
        </div>
      )}

      <Card>
        {loading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : expenses.length === 0 ? (
          <p className="text-sm text-neutral-400">No expenses recorded yet.</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="text-sm text-neutral-400">No expenses match your filters.</p>
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
              {filteredExpenses.map((expense) => (
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
                        onClick={() => setPendingDelete(expense)}
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

      {pendingDelete && (
        <ConfirmDialog
          title="Delete expense"
          message={`Delete "${pendingDelete.name}" (${formatSEK(pendingDelete.amount)})? This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
