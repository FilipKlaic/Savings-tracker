CREATE TABLE IF NOT EXISTS goal_contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    amount REAL NOT NULL,
    date TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal_id ON goal_contributions (goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_date ON goal_contributions (date);
