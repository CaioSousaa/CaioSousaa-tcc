interface PrazoBadgeProps {
  dataPrazo?: string;
}

export default function PrazoBadge({ dataPrazo }: PrazoBadgeProps) {
  if (!dataPrazo) return null;

  const prazo = new Date(dataPrazo);
  const agora = new Date();
  const diffMs = prazo.getTime() - agora.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let bgColor = "bg-blue-100 text-blue-800";
  let texto = "";

  if (diffDias < 0) {
    bgColor = "bg-red-100 text-red-800";
    texto = `Atrasado ${Math.abs(diffDias)}d`;
  } else if (diffDias === 0) {
    bgColor = "bg-orange-100 text-orange-800";
    texto = "Hoje";
  } else if (diffDias === 1) {
    bgColor = "bg-yellow-100 text-yellow-800";
    texto = "Amanhã";
  } else {
    bgColor = "bg-green-100 text-green-800";
    texto = `${diffDias}d`;
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${bgColor}`}>
      {texto}
    </span>
  );
}
