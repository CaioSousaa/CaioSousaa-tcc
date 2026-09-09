"use client";

import { FormEvent, useState } from "react";
import { BOARD_COLOR_CLASSES, BOARD_COLORS, BoardColor } from "@/lib/board-colors";

interface BoardFormModalProps {
  title: string;
  confirmLabel: string;
  initialName?: string;
  initialColor?: BoardColor;
  onSubmit: (name: string, color: BoardColor) => Promise<void>;
  onClose: () => void;
}

export function BoardFormModal({
  title,
  confirmLabel,
  initialName = "",
  initialColor = "slate",
  onSubmit,
  onClose,
}: BoardFormModalProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState<BoardColor>(initialColor);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Nome do quadro é obrigatório");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), color);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o quadro");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor="board-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nome do quadro
          </label>
          <input
            id="board-name"
            type="text"
            placeholder="Ex.: Sprint 13"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="mb-4 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />

          <span className="mb-1.5 block text-sm font-medium text-slate-700">Cor</span>
          <div className="mb-6 flex gap-2">
            {BOARD_COLORS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColor(option)}
                aria-label={option}
                className={`h-8 w-8 rounded-md ${BOARD_COLOR_CLASSES[option]} ${
                  color === option ? "ring-2 ring-offset-2 ring-slate-500" : ""
                }`}
              />
            ))}
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
            >
              {submitting ? "Salvando..." : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
