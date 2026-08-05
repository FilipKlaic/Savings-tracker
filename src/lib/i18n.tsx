import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Language } from "./language";

const STORAGE_KEY = "savings-tracker:language";

const en = {
  common: {
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    loading: "Loading…",
    moreInfo: "More info",
  },
  theme: {
    light: "Light",
    system: "System",
    dark: "Dark",
  },
  nav: {
    appName: "Savings",
    appTagline: "Personal finance tracker",
    dashboard: "Dashboard",
    income: "Income",
    expenses: "Expenses",
    goals: "Goals",
    history: "History",
    settings: "Settings",
  },
  modal: {
    close: "Close",
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview for {month}",
    totalIncome: "Total income",
    totalIncomeInfo: "The sum of all income entries recorded this month.",
    totalExpenses: "Total expenses",
    totalExpensesInfo:
      "The sum of all expenses recorded this month, recurring and one-time.",
    allocatedToSavings: "Allocated to savings",
    allocatedToSavingsInfo:
      "Your savings percentage (set in Settings) applied to this month's total income.",
    discretionaryLeft: "Discretionary left",
    discretionaryLeftInfo:
      "What remains after expenses and savings are subtracted from income — yours to spend freely.",
    movedToGoals: "{amount} moved to goals",
    breakdownTitle: "This month's breakdown",
    noDataThisMonth: "No data for this month yet.",
    chartSavings: "Savings",
    chartExpenses: "Expenses",
    chartDiscretionary: "Discretionary",
  },
  income: {
    title: "Income",
    subtitle: "Track every payment that comes in.",
    addButton: "+ Add income",
    searchPlaceholder: "Search by source…",
    allTime: "All time",
    colDate: "Date",
    colSource: "Source",
    colCategory: "Category",
    colAmount: "Amount",
    emptyNone: "No income entries yet.",
    emptyFiltered: "No income entries match your filters.",
    modalAdd: "Add income",
    modalEdit: "Edit income",
    deleteTitle: "Delete income entry",
    deleteMessage: 'Delete "{source}" ({amount})? This can\'t be undone.',
    formSource: "Source",
    formSourcePlaceholder: "e.g. Acme AB",
    formCategory: "Category",
    formAmount: "Amount (kr)",
    formDate: "Date",
    formSubmitAdd: "Add income",
    formSubmitSave: "Save changes",
    categories: {
      salary: "Salary",
      csn: "CSN",
      freelance: "Freelance",
      gear_sale: "Gear sale",
      other: "Other",
    },
  },
  expenses: {
    title: "Expenses",
    subtitle: "Keep track of fixed and one-time costs.",
    addButton: "+ Add expense",
    searchPlaceholder: "Search by name…",
    allTime: "All time",
    colDate: "Date",
    colName: "Name",
    colType: "Type",
    colAmount: "Amount",
    recurring: "Recurring",
    oneTime: "One-time",
    emptyNone: "No expenses recorded yet.",
    emptyFiltered: "No expenses match your filters.",
    modalAdd: "Add expense",
    modalEdit: "Edit expense",
    deleteTitle: "Delete expense",
    deleteMessage: 'Delete "{name}" ({amount})? This can\'t be undone.',
    carryOverOne:
      "You have 1 recurring expense not yet added this month: {names}",
    carryOverMany:
      "You have {count} recurring expenses not yet added this month: {names}",
    carryOverButton: "Add to this month",
    formName: "Name",
    formNamePlaceholder: "e.g. Rent",
    formAmount: "Amount (kr)",
    formDate: "Date",
    formRecurringLabel: "Recurring monthly expense",
    formSubmitAdd: "Add expense",
    formSubmitSave: "Save changes",
  },
  goals: {
    title: "Goals",
    subtitle: "Save toward the things that matter.",
    addButton: "+ Add goal",
    allocationText: "This month's savings allocation is {amount}",
    allocationWithContrib:
      " — {contributed} already contributed to goals, {remaining} left to assign.",
    emptyNone: "No goals yet — create your first one.",
    modalCreate: "Create goal",
    modalEdit: "Edit goal",
    deleteTitle: "Delete goal",
    deleteMessage: 'Delete "{name}"? This can\'t be undone.',
    started: "Started {date}",
    contribute: "Contribute",
    ofTarget: "of {amount}",
    goalReached: "Goal reached",
    percentFunded: "{percent}% funded",
    formName: "Goal name",
    formNamePlaceholder: "e.g. New camera lens",
    formTargetAmount: "Target amount (kr)",
    formCurrentProgress: "Current progress",
    formStartingAmount: "Starting amount (kr)",
    formCurrentProgressNote:
      'Use "Contribute" on the goal card to add to your progress.',
    formSubmitCreate: "Create goal",
    formSubmitSave: "Save changes",
    contributeModalTitle: "Contribute to {name}",
    contributeCurrently: "Currently {current} of {target}.",
    contributeAmountLabel: "Amount to add (kr)",
    contributeSuggestion: "Use remaining savings allocation ({amount})",
    contributeSubmit: "Add to goal",
  },
  history: {
    title: "History",
    subtitle: "How your savings rate has moved over time.",
    trendTitle: "Savings rate trend",
    emptyNone: "No history yet.",
    colMonth: "Month",
    colIncome: "Income",
    colExpenses: "Expenses",
    colSavings: "Savings",
    colDiscretionary: "Discretionary",
    colRate: "Rate",
    chartSeriesName: "Savings rate",
  },
  settings: {
    title: "Settings",
    subtitle: "Configure how your income is automatically allocated.",
    cardTitle: "Savings rule",
    description:
      "Automatically set aside this percentage of every krona of income toward savings, before discretionary spending.",
    save: "Save",
    saved: "Saved ✓",
  },
};

type Translations = typeof en;

const sv: Translations = {
  common: {
    edit: "Redigera",
    delete: "Ta bort",
    cancel: "Avbryt",
    loading: "Laddar…",
    moreInfo: "Mer information",
  },
  theme: {
    light: "Ljust",
    system: "System",
    dark: "Mörkt",
  },
  nav: {
    appName: "Sparande",
    appTagline: "Personlig ekonomi",
    dashboard: "Översikt",
    income: "Inkomster",
    expenses: "Utgifter",
    goals: "Mål",
    history: "Historik",
    settings: "Inställningar",
  },
  modal: {
    close: "Stäng",
  },
  dashboard: {
    title: "Översikt",
    subtitle: "Översikt för {month}",
    totalIncome: "Total inkomst",
    totalIncomeInfo: "Summan av alla inkomster registrerade denna månad.",
    totalExpenses: "Totala utgifter",
    totalExpensesInfo:
      "Summan av alla utgifter denna månad, både återkommande och engångsutgifter.",
    allocatedToSavings: "Avsatt till sparande",
    allocatedToSavingsInfo:
      "Din sparprocent (inställd under Inställningar) tillämpad på denna månads totala inkomst.",
    discretionaryLeft: "Kvar att spendera",
    discretionaryLeftInfo:
      "Det som blir kvar när utgifter och sparande dragits från inkomsten — fritt att spendera.",
    movedToGoals: "{amount} flyttat till mål",
    breakdownTitle: "Denna månads fördelning",
    noDataThisMonth: "Ingen data för denna månad än.",
    chartSavings: "Sparande",
    chartExpenses: "Utgifter",
    chartDiscretionary: "Fritt att spendera",
  },
  income: {
    title: "Inkomster",
    subtitle: "Håll koll på alla betalningar som kommer in.",
    addButton: "+ Lägg till inkomst",
    searchPlaceholder: "Sök efter källa…",
    allTime: "Alla perioder",
    colDate: "Datum",
    colSource: "Källa",
    colCategory: "Kategori",
    colAmount: "Belopp",
    emptyNone: "Inga inkomster registrerade än.",
    emptyFiltered: "Inga inkomster matchar dina filter.",
    modalAdd: "Lägg till inkomst",
    modalEdit: "Redigera inkomst",
    deleteTitle: "Ta bort inkomst",
    deleteMessage: 'Ta bort "{source}" ({amount})? Detta kan inte ångras.',
    formSource: "Källa",
    formSourcePlaceholder: "t.ex. Acme AB",
    formCategory: "Kategori",
    formAmount: "Belopp (kr)",
    formDate: "Datum",
    formSubmitAdd: "Lägg till inkomst",
    formSubmitSave: "Spara ändringar",
    categories: {
      salary: "Lön",
      csn: "CSN",
      freelance: "Frilans",
      gear_sale: "Utrustningsförsäljning",
      other: "Övrigt",
    },
  },
  expenses: {
    title: "Utgifter",
    subtitle: "Håll koll på fasta och engångskostnader.",
    addButton: "+ Lägg till utgift",
    searchPlaceholder: "Sök efter namn…",
    allTime: "Alla perioder",
    colDate: "Datum",
    colName: "Namn",
    colType: "Typ",
    colAmount: "Belopp",
    recurring: "Återkommande",
    oneTime: "Engångs",
    emptyNone: "Inga utgifter registrerade än.",
    emptyFiltered: "Inga utgifter matchar dina filter.",
    modalAdd: "Lägg till utgift",
    modalEdit: "Redigera utgift",
    deleteTitle: "Ta bort utgift",
    deleteMessage: 'Ta bort "{name}" ({amount})? Detta kan inte ångras.',
    carryOverOne:
      "Du har 1 återkommande utgift som inte lagts till denna månad: {names}",
    carryOverMany:
      "Du har {count} återkommande utgifter som inte lagts till denna månad: {names}",
    carryOverButton: "Lägg till denna månad",
    formName: "Namn",
    formNamePlaceholder: "t.ex. Hyra",
    formAmount: "Belopp (kr)",
    formDate: "Datum",
    formRecurringLabel: "Återkommande månadsutgift",
    formSubmitAdd: "Lägg till utgift",
    formSubmitSave: "Spara ändringar",
  },
  goals: {
    title: "Mål",
    subtitle: "Spara till det som betyder något.",
    addButton: "+ Lägg till mål",
    allocationText: "Denna månads sparbelopp är {amount}",
    allocationWithContrib:
      " — {contributed} redan bidraget till mål, {remaining} kvar att fördela.",
    emptyNone: "Inga mål än — skapa ditt första.",
    modalCreate: "Skapa mål",
    modalEdit: "Redigera mål",
    deleteTitle: "Ta bort mål",
    deleteMessage: 'Ta bort "{name}"? Detta kan inte ångras.',
    started: "Startade {date}",
    contribute: "Bidra",
    ofTarget: "av {amount}",
    goalReached: "Mål uppnått",
    percentFunded: "{percent}% finansierat",
    formName: "Målnamn",
    formNamePlaceholder: "t.ex. Nytt kameraobjektiv",
    formTargetAmount: "Målbelopp (kr)",
    formCurrentProgress: "Nuvarande framsteg",
    formStartingAmount: "Startbelopp (kr)",
    formCurrentProgressNote:
      'Använd "Bidra" på målkortet för att lägga till framsteg.',
    formSubmitCreate: "Skapa mål",
    formSubmitSave: "Spara ändringar",
    contributeModalTitle: "Bidra till {name}",
    contributeCurrently: "Just nu {current} av {target}.",
    contributeAmountLabel: "Belopp att lägga till (kr)",
    contributeSuggestion: "Använd återstående sparbelopp ({amount})",
    contributeSubmit: "Lägg till i mål",
  },
  history: {
    title: "Historik",
    subtitle: "Hur din sparkvot har förändrats över tid.",
    trendTitle: "Trend för sparkvot",
    emptyNone: "Ingen historik än.",
    colMonth: "Månad",
    colIncome: "Inkomst",
    colExpenses: "Utgifter",
    colSavings: "Sparande",
    colDiscretionary: "Fritt att spendera",
    colRate: "Kvot",
    chartSeriesName: "Sparkvot",
  },
  settings: {
    title: "Inställningar",
    subtitle: "Ställ in hur din inkomst fördelas automatiskt.",
    cardTitle: "Sparregel",
    description:
      "Avsätt automatiskt denna procent av varje intjänad krona till sparande, innan fri spendering.",
    save: "Spara",
    saved: "Sparat ✓",
  },
};

const dictionaries: Record<Language, Translations> = { en, sv };

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in params ? String(params[key]) : match,
  );
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem(STORAGE_KEY) as Language | null) ?? "en",
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = dictionaries[language];
    return {
      language,
      setLanguage: setLanguageState,
      t: (key, params) => {
        const value = getByPath(dict, key);
        return typeof value === "string" ? interpolate(value, params) : key;
      },
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
