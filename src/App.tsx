import { useState } from "react";
import type { ComponentType } from "react";
import { Sidebar } from "./components/Sidebar";
import type { NavKey } from "./lib/nav";
import { useTheme } from "./lib/theme";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { IncomePage } from "./features/income/IncomePage";
import { ExpensesPage } from "./features/expenses/ExpensesPage";
import { GoalsPage } from "./features/goals/GoalsPage";
import { HistoryPage } from "./features/history/HistoryPage";
import { SettingsPage } from "./features/settings/SettingsPage";

const PAGES: Record<NavKey, ComponentType> = {
  dashboard: DashboardPage,
  income: IncomePage,
  expenses: ExpensesPage,
  goals: GoalsPage,
  history: HistoryPage,
  settings: SettingsPage,
};

function App() {
  const [page, setPage] = useState<NavKey>("dashboard");
  const [theme, setTheme] = useTheme();
  const Page = PAGES[page];

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        active={page}
        onSelect={setPage}
        theme={theme}
        onThemeChange={setTheme}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl">
          <Page />
        </div>
      </main>
    </div>
  );
}

export default App;
