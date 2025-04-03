
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const statCardVariants = cva(
  "rounded-lg p-6 flex flex-col space-y-2 bg-white shadow-sm border",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        primary: "border-l-4 border-l-jira-blue",
        success: "border-l-4 border-l-green-500",
        warning: "border-l-4 border-l-amber-500",
        danger: "border-l-4 border-l-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant,
  className,
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold stat-card-value">{value}</span>
        {subtext && <span className="text-xs text-gray-500 mt-1">{subtext}</span>}
      </div>
    </div>
  );
}
