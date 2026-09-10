"use client";

interface Card {
  id: string;
  titulo: string;
  descricao?: string;
}

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  onDragStart?: (e: React.DragEvent, cardId: string, listaId: string) => void;
}

export function CardItem({ card, onEdit, onDelete, onDragStart }: CardItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, card.id, "")}
      className="bg-zinc-100 dark:bg-zinc-700 rounded p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition group"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-black dark:text-white text-sm break-words">
            {card.titulo}
          </p>
          {card.descricao && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
              {card.descricao}
            </p>
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
