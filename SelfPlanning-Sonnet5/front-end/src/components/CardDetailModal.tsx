"use client";

import { useState } from "react";
import { Card } from "@/lib/cards";
import { List } from "@/lib/lists";
import { Label, LABEL_COLOR_CHIP_CLASSES } from "@/lib/labels";
import { ChecklistSection } from "./ChecklistSection";
import { AssigneesSection } from "./AssigneesSection";
import { CommentsSection } from "./CommentsSection";
import { LabelsModal } from "./LabelsModal";

interface CardDetailModalProps {
  boardId: string;
  card: Card;
  lists: List[];
  onSave: (
    title: string,
    description: string | null,
    listId: string,
    dueDate: string | null
  ) => Promise<void>;
  onDelete: () => void;
  onClose: () => void;
  onLabelsChange: (labels: Label[]) => void;
  onLabelCreated?: (label: Label) => void;
}

export function CardDetailModal({
  boardId,
  card,
  lists,
  onSave,
  onDelete,
  onClose,
  onLabelsChange,
  onLabelCreated,
}: CardDetailModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [listId, setListId] = useState(card.listId);
  const [dueDate, setDueDate] = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().slice(0, 10) : ""
  );
  const [labels, setLabels] = useState<Label[]>(card.labels ?? []);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleLabelsChange(updated: Label[]) {
    setLabels(updated);
    onLabelsChange(updated);
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Título é obrigatório");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave(
        title.trim(),
        description.trim() ? description.trim() : null,
        listId,
        dueDate ? dueDate : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o card");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-bold text-slate-900 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <label htmlFor="card-description" className="mb-1.5 block text-sm font-medium text-slate-700">
          Descrição
        </label>
        <textarea
          id="card-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Adicione uma descrição..."
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />

        <label htmlFor="card-list" className="mb-1.5 block text-sm font-medium text-slate-700">
          Lista
        </label>
        <select
          id="card-list"
          value={listId}
          onChange={(e) => setListId(e.target.value)}
          className="mb-6 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>

        <label htmlFor="card-due-date" className="mb-1.5 block text-sm font-medium text-slate-700">
          Prazo
        </label>
        <div className="mb-6">
          <input
            id="card-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {card.isOverdue && (
            <p className="mt-2 inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
              Atrasado há {card.overdueDays} {card.overdueDays === 1 ? "dia" : "dias"}
            </p>
          )}
        </div>

        <div className="mb-6">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Etiquetas</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {labels.map((label) => (
              <span
                key={label.id}
                className={`rounded px-2 py-0.5 text-xs font-medium ${LABEL_COLOR_CHIP_CLASSES[label.color]}`}
              >
                {label.name}
              </span>
            ))}
            <button
              onClick={() => setShowLabelsModal(true)}
              className="rounded border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 hover:border-slate-400 hover:text-slate-700"
            >
              + Gerenciar
            </button>
          </div>
        </div>

        <AssigneesSection boardId={boardId} cardId={card.id} />

        <ChecklistSection boardId={boardId} cardId={card.id} />

        <CommentsSection boardId={boardId} cardId={card.id} />

        {error && <p className="mb-4 mt-4 text-sm text-red-600">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={onDelete}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Excluir card
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar card"}
          </button>
        </div>
      </div>

      {showLabelsModal && (
        <LabelsModal
          boardId={boardId}
          cardId={card.id}
          appliedLabelIds={labels.map((label) => label.id)}
          onChange={handleLabelsChange}
          onLabelCreated={onLabelCreated}
          onClose={() => setShowLabelsModal(false)}
        />
      )}
    </div>
  );
}
