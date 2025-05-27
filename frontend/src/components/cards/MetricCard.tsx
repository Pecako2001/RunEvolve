"use client";

import { Card, Text } from "@mantine/core";
import globalStyles from "../../styles/global.module.css";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  children: ReactNode;
}

export default function MetricCard({ label, children }: MetricCardProps) {
  return (
    <Card
      className={`card-base ${globalStyles.cardHover}`}
    >
      <Text className="card-label" fw={700} mb="xs">
        {label}
      </Text>
      {children}
    </Card>
  );
}
