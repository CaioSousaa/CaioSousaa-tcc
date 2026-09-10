"use client";

interface ChecklistProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export function ChecklistProgress({ completed, total, percentage }: ChecklistProgressProps) {
  if (total === 0) return null;

  let bgColor = "bg-red-500";
  if (percentage >= 75) bgColor = "bg-green-500";
  else if (percentage >= 50) bgColor = "bg-yellow-500";

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Progresso: {completed}/{total}
        </span>
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
