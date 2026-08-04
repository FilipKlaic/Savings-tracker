import type { GoalContribution } from "../../types";
import { monthKeyOf } from "../../lib/format";

export function sumContributionsInMonth(
  contributions: GoalContribution[],
  monthKey: string,
): number {
  return contributions
    .filter((c) => monthKeyOf(c.date) === monthKey)
    .reduce((sum, c) => sum + c.amount, 0);
}
