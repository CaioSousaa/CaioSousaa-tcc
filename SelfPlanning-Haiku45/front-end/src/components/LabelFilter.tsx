import { useState, useEffect } from "react";
import { getLabels } from "@/lib/api";
import LabelBadge from "./LabelBadge";

interface Label {
  id: string;
  nome: string;
  cor: string;
}

interface LabelFilterProps {
  boardId: string;
  onFilterChange: (labelIds: string[]) => void;
}

export default function LabelFilter({ boardId, onFilterChange }: LabelFilterProps) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadLabels = async () => {
      try {
        const res = await getLabels(boardId);
        setLabels(res.data);
      } catch (err) {
        console.error("Erro ao carregar etiquetas", err);
      }
    };

    loadLabels();
  }, [boardId]);

  const handleToggleLabel = (labelId: string) => {
    const newSelected = new Set(selectedLabels);
    if (newSelected.has(labelId)) {
      newSelected.delete(labelId);
    } else {
      newSelected.add(labelId);
    }
    setSelectedLabels(newSelected);
    onFilterChange(Array.from(newSelected));
  };

  const handleClearFilter = () => {
    setSelectedLabels(new Set());
    onFilterChange([]);
  };

  if (labels.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
      >
        Filtrar por Etiqueta {selectedLabels.size > 0 && `(${selectedLabels.size})`}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-3 z-10 min-w-48">
          <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
            {labels.map((label) => (
              <label key={label.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLabels.has(label.id)}
                  onChange={() => handleToggleLabel(label.id)}
                  className="h-4 w-4"
                />
                <LabelBadge nome={label.nome} cor={label.cor} />
              </label>
            ))}
          </div>
          {selectedLabels.size > 0 && (
            <button
              onClick={handleClearFilter}
              className="w-full px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Limpar Filtro
            </button>
          )}
        </div>
      )}
    </div>
  );
}
