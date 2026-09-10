interface LabelBadgeProps {
  nome: string;
  cor: string;
}

const colorMap: Record<string, string> = {
  vermelho: "bg-red-200 text-red-800",
  azul: "bg-blue-200 text-blue-800",
  verde: "bg-green-200 text-green-800",
  amarelo: "bg-yellow-200 text-yellow-800",
  roxo: "bg-purple-200 text-purple-800",
  rosa: "bg-pink-200 text-pink-800",
  laranja: "bg-orange-200 text-orange-800",
  cinza: "bg-gray-200 text-gray-800",
};

export default function LabelBadge({ nome, cor }: LabelBadgeProps) {
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${colorMap[cor] || colorMap.cinza}`}>
      {nome}
    </span>
  );
}
