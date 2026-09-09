"use client";

import { useState } from "react";
import { List } from "@/lib/lists";

interface DeleteListDialogProps {
  list: List;
  cardCount: number;
  otherLists: List[];
  submitting: boolean;
  onConfirm: (strategy: "move" | "delete", destinationListId?: string) => void;
  onCancel: () => void;
}

export function DeleteListDialog({
  list,
  cardCount,
  otherLists,
  submitting,
  onConfirm,
  onCancel,
}: DeleteListDialogProps) {
  const [strategy, setStrategy] = useState<"move" | "delete">(
    otherLists.length > 0 ? "move" : "delete"
  );
  const [destinationListId, setDestinationListId] = useState(otherLists[0]?.id ?? "");

  function handleConfirm() {
    if (strategy === "move") {
      onConfirm("move", destinationListId);
    } else {
      onConfirm("delete");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">Excluir a lista &quot;{list.name}&quot;?</h2>
        <p className="mt-2 text-sm text-slate-500">
          Ela contém {cardCount} {cardCount === 1 ? "card" : "cards"}. Escolha o que deve
          acontecer com eles.
        </p>

        <div className="mt-4 space-y-3">
          <label
            className={`flex cursor-pointer flex-col gap-2 rounded-md border p-3 ${
              strategy === "move" ? "border-slate-500 bg-slate-50" : "border-zinc-200"
            } ${otherLists.length === 0 ? "opacity-40" : ""}`}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <input
                type="radio"
                name="strategy"
                checked={strategy === "move"}
                disabled={otherLists.length === 0}
                onChange={() => setStrategy("move")}
              />
              Mover os cards para outra lista
            </span>
            {strategy === "move" && (
              <select
                value={destinationListId}
                onChange={(e) => setDestinationListId(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
              >
                {otherLists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            )}
          </label>

          <label
            className={`flex items-center gap-2 rounded-md border p-3 text-sm font-medium ${
              strategy === "delete" ? "border-red-400 bg-red-50 text-red-700" : "border-zinc-200 text-slate-800"
            }`}
          >
            <input
              type="radio"
              name="strategy"
              checked={strategy === "delete"}
              onChange={() => setStrategy("delete")}
            />
            Excluir a lista e todos os cards (ação irreversível)
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || (strategy === "move" && !destinationListId)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {submitting ? "Confirmando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
