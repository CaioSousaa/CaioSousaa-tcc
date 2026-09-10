"use client";

import LabelBadge from "./LabelBadge";
import PrazoBadge from "./PrazoBadge";

interface Label {
  id: string;
  nome: string;
  cor: string;
}

interface Card {
  id: string;
  titulo: string;
  descricao?: string;
  dataPrazo?: string;
  statusPrazo?: string;
  checklistProgress?: {
    total: number;
    completed: number;
    percentage: number;
  };
  labels?: Label[];
}

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  onEditLabels?: (cardId: string) => void;
  onDragStart?: (e: React.DragEvent, cardId: string, listaId: string) => void;
}

export function CardItem({ card, onEdit, onDelete, onEditLabels, onDragStart }: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, card.id, "")}
      className="bg-zinc-100 dark:bg-zinc-700 rounded p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition group"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-black dark:text-white text-sm wrap-break-word">
            {card.titulo}
          </p>
          {card.descricao && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
              {card.descricao}
            </p>
          )}
          {card.dataPrazo && (
            <div className="mt-2">
              <PrazoBadge dataPrazo={card.dataPrazo} />
            </div>
          )}
          {card.labels && card.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {card.labels.map((label) => (
                <LabelBadge key={label.id} nome={label.nome} cor={label.cor} />
              ))}
            </div>
          )}
          {card.checklistProgress && card.checklistProgress.total > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <div className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-600 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    card.checklistProgress.percentage >= 75
                      ? "bg-green-500"
                      : card.checklistProgress.percentage >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${card.checklistProgress.percentage}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {card.checklistProgress.completed}/{card.checklistProgress.total}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(card)}
            className="p-1 text-xs bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded"
            title="Editar"
          >
            ✎
          </button>
          {onEditLabels && (
            <button
              onClick={() => onEditLabels(card.id)}
              className="p-1 text-xs bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-400 rounded"
              title="Editar Etiquetas"
            >
              🏷
            </button>
          )}
          <button
            onClick={() => onDelete(card.id)}
            className="p-1 text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded"
            title="Deletar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
