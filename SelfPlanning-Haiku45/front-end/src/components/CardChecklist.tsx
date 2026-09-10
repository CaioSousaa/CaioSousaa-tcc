"use client";

import { useState, FormEvent } from "react";
import { ChecklistProgress } from "./ChecklistProgress";

interface ChecklistItem {
  id: string;
  titulo: string;
  concluido: boolean;
  ordem: number;
}

interface ChecklistProgress {
  total: number;
  completed: number;
  percentage: number;
}

interface CardChecklistProps {
  items: ChecklistItem[];
  progress: ChecklistProgress;
  onAddItem: (titulo: string) => Promise<void>;
  onToggleItem: (itemId: string, concluido: boolean) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  loading?: boolean;
}

export function CardChecklist({
  items,
  progress,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  loading = false,
}: CardChecklistProps) {
  const [newItemTitle, setNewItemTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleAddItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    try {
      await onAddItem(newItemTitle);
      setNewItemTitle("");
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
      <h3 className="font-semibold text-black dark:text-white mb-2">Checklist</h3>

      <ChecklistProgress
        completed={progress.completed}
        total={progress.total}
        percentage={progress.percentage}
      />

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.concluido}
              onChange={(e) => onToggleItem(item.id, e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span
              className={`flex-1 text-sm ${
                item.concluido
                  ? "line-through text-zinc-400 dark:text-zinc-500"
                  : "text-black dark:text-white"
              }`}
            >
              {item.titulo}
            </span>
            <button
              onClick={() => onDeleteItem(item.id)}
              className="text-xs px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddItem} className="mt-3 flex gap-2">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            maxLength={200}
            placeholder="Novo item..."
            autoFocus
            className="flex-1 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddForm(false);
              setNewItemTitle("");
            }}
            className="px-2 py-1 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm rounded"
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-3 w-full py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
        >
          + Adicionar item
        </button>
      )}
    </div>
  );
}
