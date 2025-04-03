
import React from "react";
import { cn } from "@/lib/utils";

interface TopItem {
  name: string;
  code?: string;
  value: number | string;
}

interface TopItemsListProps {
  title: string;
  items: TopItem[];
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
}

export function TopItemsList({
  title,
  items,
  valuePrefix = "",
  valueSuffix = "",
  className,
}: TopItemsListProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-4", className)}>
      <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.code || index} className="flex justify-between items-center py-1">
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-jira-gray-light text-jira-gray mr-2 text-sm">
                {index + 1}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-sm text-jira-gray-dark font-medium">
              {valuePrefix}
              {item.value}
              {valueSuffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
