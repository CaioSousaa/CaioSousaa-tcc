export const LABEL_COLORS = ["red", "blue", "green", "amber", "purple", "gray"] as const;
export type LabelColor = (typeof LABEL_COLORS)[number];

export const LABEL_COLOR_CLASSES: Record<LabelColor, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  gray: "bg-slate-400",
};

export const LABEL_COLOR_CHIP_CLASSES: Record<LabelColor, string> = {
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-800",
  purple: "bg-purple-100 text-purple-700",
  gray: "bg-slate-200 text-slate-700",
};

export interface Label {
  id: string;
  name: string;
  color: LabelColor;
  boardId: string;
  createdAt: string;
  cardCount?: number;
}
