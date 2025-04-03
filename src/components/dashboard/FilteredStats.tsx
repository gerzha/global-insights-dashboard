
import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency, getTierText } from "@/utils/dashboardUtils";

interface FilteredStatsProps {
  title: string;
  stats: {
    totalTransactions: number;
    totalAmount: number;
    avgAmount: number;
  } | null;
  className?: string;
}

export function FilteredStats({ title, stats, className }: FilteredStatsProps) {
  if (!stats) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <p className="text-gray-500 text-sm">Select filters to view stats</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Total Amount"
          value={formatCurrency(stats.totalAmount)}
          subtext={`${getTierText(stats.totalAmount)} (in USD)`}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Average Transaction"
          value={formatCurrency(stats.avgAmount)}
          subtext={`${getTierText(stats.avgAmount)} (in USD)`}
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}
