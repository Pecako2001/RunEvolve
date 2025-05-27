"use client";

import React from "react";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";

export interface SalesCardProps {
  title: string;
  value: string | number;
  percentage: number;
  subtitle?: string;
  badgeLabel?: string;
}

const SalesCard: React.FC<SalesCardProps> = ({
  title,
  value,
  percentage,
  subtitle,
  badgeLabel,
}) => {
  const isPositive = percentage >= 0;
  const PercentageIcon = isPositive ? IconArrowUpRight : IconArrowDownRight;
  const percentColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
      {badgeLabel && (
        <span className="absolute right-4 top-4 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          {badgeLabel}
        </span>
      )}
      <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="flex items-center gap-1 text-sm">
        <PercentageIcon
          data-testid="percentage-icon"
          className={`${percentColor}`}
          size={16}
          aria-hidden="true"
        />
        <span data-testid="percentage" className={percentColor}>
          {Math.abs(percentage)}%
        </span>
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
      )}
    </div>
  );
};

export default SalesCard;
