"use client";

import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import MetricCard from "../cards/MetricCard";
import { getCurrentWeekKey } from "../../utils/time";

interface StatDetail {
  count: number;
  total_distance: number;
}

interface Stats {
  weekly: Record<string, StatDetail>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RunsThisWeekCard() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/runs/stats`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch stats");
        return r.json();
      })
      .then((data: Stats) => {
        const week = getCurrentWeekKey();
        const stat = data.weekly?.[week];
        setCount(stat ? stat.count : 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MetricCard label="Runs This Week">
      {loading && <Loader size="sm" />}
      {!loading && error && <Text>{error}</Text>}
      {!loading && !error && <Text fw={700}>{count}</Text>}
    </MetricCard>
  );
}
