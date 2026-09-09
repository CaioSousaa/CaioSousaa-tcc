"use client";

import { FormEvent, useState } from "react";
import { List } from "@/lib/lists";
import { Card } from "@/lib/cards";
import { CardItem } from "./CardItem";

interface ListColumnProps {
  list: List;
  cards: Card[];
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onRename: (name: string) => Promise<void>;
  onDelete: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onAddCard: (title: string) => Promise<void>;
  onOpenCard: (card: Card) => void;
  onMoveCardUp: (card: Card, index: number) => void;
  onMoveCardDown: (card: Card, index: number) => void;
}

export function ListColumn({
  list,
  cards,
  canMoveLeft,
  canMoveRight,
  onRename,
  onDelete,
  onMoveLeft,
  onMoveRight,
  onAddCard,
  onOpenCard,
  onMoveCardUp,
  onMoveCardDown,
}: ListColumnProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const [saving, setSaving] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [creatingCard, setCreatingCard] = useState(false);

  async function handleSave() {
    if (!name.trim() || name.trim() === list.name) {
      setName(list.name);
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onRename(name.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddCard(event: FormEvent) {
    event.preventDefault();
    if (!newCardTitle.trim()) return;

    setCreatingCard(true);
    try {
      await onAddCard(newCardTitle.trim());
      setNewCardTitle("");
      setShowAddCard(false);
    } finally {
      setCreatingCard(false);
    }
  }

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-zinc-100 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setName(list.name);
                setEditing(false);
              }
            }}
            disabled={saving}
            className="w-full rounded border border-slate-300 px-2 py-1 text-sm font-semibold text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="truncate text-left text-sm font-semibold text-slate-900"
          >
            {list.name}
          </button>
        )}

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onClick={onMoveLeft}
            disabled={!canMoveLeft}
            aria-label="Mover lista para a esquerda"
            className="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
          >
            ←
          </button>
          <button
            onClick={onMoveRight}
            disabled={!canMoveRight}
            aria-label="Mover lista para a direita"
            className="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
          >
            →
          </button>
          <button
            onClick={() => setEditing(true)}
            aria-label="Renomear lista"
            className="rounded p-1 text-slate-500 hover:bg-slate-200"
          >
            ✎
          </button>
          <button
            onClick={onDelete}
            aria-label="Excluir lista"
            className="rounded p-1 text-slate-500 hover:bg-red-100 hover:text-red-600"
          >
            🗑
          </button>
        </div>
      </div>

      <div>
        {cards.map((card, index) => (
          <CardItem
            key={card.id}
            card={card}
            canMoveUp={index > 0}
            canMoveDown={index < cards.length - 1}
            onOpen={() => onOpenCard(card)}
            onMoveUp={() => onMoveCardUp(card, index)}
            onMoveDown={() => onMoveCardDown(card, index)}
          />
        ))}

        {cards.length === 0 && !showAddCard && (
          <p className="mb-2 rounded-md border border-dashed border-zinc-300 px-3 py-6 text-center text-xs text-slate-400">
            Nenhum card ainda
          </p>
        )}

        {showAddCard ? (
          <form onSubmit={handleAddCard}>
            <input
              autoFocus
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Título do card"
              className="mb-2 w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creatingCard}
                className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCard(false);
                  setNewCardTitle("");
                }}
                className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-zinc-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-500 hover:bg-zinc-200"
          >
            + Adicionar card
          </button>
        )}
      </div>
    </div>
  );
}
