CREATE TABLE IF NOT EXISTS income_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('salary', 'csn', 'freelance', 'gear_sale', 'other')),
    amount REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    recurring INTEGER NOT NULL DEFAULT 0,
    date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL NOT NULL DEFAULT 0,
    created_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    savings_percentage REAL NOT NULL DEFAULT 20
);

INSERT OR IGNORE INTO settings (id, savings_percentage) VALUES (1, 20);

CREATE INDEX IF NOT EXISTS idx_income_entries_date ON income_entries (date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses (date);
