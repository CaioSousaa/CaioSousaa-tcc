"use client";

import { useState, ReactNode } from "react";

interface List {
  id: string;
  titulo: string;
  ordem: number;
}

interface ListColumnProps {
  list: List;
  children?: ReactNode;
  onRename: (listId: string, novoTitulo: string) => Promise<void>;
  onDelete: (listId: string) => Promise<void>;
  onReorderUp: () => Promise<void>;
  onReorderDown: () => Promise<void>;
  onCreateCard?: (listId: string) => void;
}

export function ListColumn({
  list,
  children,
  onRename,
  onDelete,
  onReorderUp,
  onReorderDown,
  onCreateCard,
}: ListColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titulo, setTitulo] = useState(list.titulo);

  async function handleSave() {
    if (titulo.trim() && titulo !== list.titulo) {
      await onRename(list.id, titulo);
    } else {
      setTitulo(list.titulo);
    }
    setIsEditing(false);
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 min-w-75 flex flex-col max-h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={50}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setTitulo(list.titulo);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="flex-1 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-white text-sm"
          />
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            className="font-semibold text-black dark:text-white cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded flex-1"
          >
            {titulo}
          </h3>
        )}
        <div className="flex gap-1">
          <button
            onClick={() => onReorderUp()}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
            title="Mover para esquerda"
          >
            ←
          </button>
          <button
            onClick={() => onReorderDown()}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
            title="Mover para direita"
          >
            →
          </button>
          <button
            onClick={() => onDelete(list.id)}
            className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded"
            title="Deletar lista"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 rounded p-3 overflow-y-auto">
        {children}
        {onCreateCard && (
          <button
            onClick={() => onCreateCard(list.id)}
            className="w-full mt-2 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
          >
            + Novo cartão
          </button>
        )}
      </div>
    </div>
  );
}
