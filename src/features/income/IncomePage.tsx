import { useEffect, useMemo, useState } from "react";
import type { IncomeEntry, NewIncomeEntry } from "../../types";
import { INCOME_CATEGORIES } from "../../types";
import { Card } from "../../components/Card";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import {
  primaryButtonClass,
  dangerTextClass,
  inputClass,
} from "../../components/formStyles";
import { formatMonthLabel, formatSEK, monthKeyOf } from "../../lib/format";
import { IncomeForm } from "./IncomeForm";
import {
  createIncomeEntry,
  deleteIncomeEntry,
  listIncomeEntries,
  updateIncomeEntry,
} from "./api";

const categoryLabels = Object.fromEntries(
  INCOME_CATEGORIES.map((c) => [c.value, c.label]),
);

export function IncomePage() {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"add" | IncomeEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<IncomeEntry | null>(null);
  const [monthFilter, setMonthFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function refresh() {
    setEntries(await listIncomeEntries());
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(entry: NewIncomeEntry) {
    if (modalMode && modalMode !== "add") {
      await updateIncomeEntry({ ...entry, id: modalMode.id });
    } else {
      await createIncomeEntry(entry);
    }
    setModalMode(null);
    await refresh();
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    await deleteIncomeEntry(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  const months = useMemo(
    () =>
      Array.from(new Set(entries.map((e) => monthKeyOf(e.date)))).sort((a, b) =>
        b.localeCompare(a),
      ),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (monthFilter !== "all" && monthKeyOf(entry.date) !== monthFilter) {
        return false;
      }
      if (query && !entry.source.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  }, [entries, monthFilter, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Income</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Track every payment that comes in.
          </p>
        </div>
        <button className={primaryButtonClass} onClick={() => setModalMode("add")}>
          + Add income
        </button>
      </div>

      {entries.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <input
            className={`${inputClass} max-w-xs`}
            placeholder="Search by source…"
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
        ) : entries.length === 0 ? (
          <p className="text-sm text-neutral-400">No income entries yet.</p>
        ) : filteredEntries.length === 0 ? (
          <p className="text-sm text-neutral-400">No income entries match your filters.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-400 dark:border-neutral-800">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 text-right font-medium">Amount</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60"
                >
                  <td className="py-2.5 text-neutral-500 dark:text-neutral-400">
                    {entry.date}
                  </td>
                  <td className="py-2.5 font-medium">{entry.source}</td>
                  <td className="py-2.5 text-neutral-500 dark:text-neutral-400">
                    {categoryLabels[entry.category]}
                  </td>
                  <td className="py-2.5 text-right font-medium tabular-nums">
                    {formatSEK(entry.amount)}
                  </td>
                  <td className="py-2.5 pl-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-sm text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        onClick={() => setModalMode(entry)}
                      >
                        Edit
                      </button>
                      <button
                        className={dangerTextClass}
                        onClick={() => setPendingDelete(entry)}
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
          title={modalMode === "add" ? "Add income" : "Edit income"}
          onClose={() => setModalMode(null)}
        >
          <IncomeForm
            initial={modalMode === "add" ? undefined : modalMode}
            onSubmit={handleSubmit}
            onCancel={() => setModalMode(null)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete income entry"
          message={`Delete "${pendingDelete.source}" (${formatSEK(pendingDelete.amount)})? This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
