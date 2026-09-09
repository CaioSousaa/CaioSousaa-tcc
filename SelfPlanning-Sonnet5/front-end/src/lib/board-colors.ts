export const BOARD_COLORS = ["slate", "blue", "green", "amber", "purple"] as const;
export type BoardColor = (typeof BOARD_COLORS)[number];

export const BOARD_COLOR_CLASSES: Record<BoardColor, string> = {
  slate: "bg-slate-800",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
};

export interface Board {
  id: string;
  name: string;
  color: BoardColor;
  createdAt: string;
  updatedAt: string;
}
