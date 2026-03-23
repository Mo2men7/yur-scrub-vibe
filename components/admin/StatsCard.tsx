import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: "blue" | "amber" | "green" | "red";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  amber:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  green:
    "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
}: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
      <div className={cn("p-3 rounded-xl", colorMap[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      </div>
    </div>
  );
}
