import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, action, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
