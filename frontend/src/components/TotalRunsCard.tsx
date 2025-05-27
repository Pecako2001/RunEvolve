"use client";

import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import MetricCard from "./MetricCard";

interface StatDetail {
  count: number;
  total_distance: number;
}

interface Stats {
  yearly: Record<string, StatDetail>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TotalRunsCard() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/runs/stats`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch stats");
        return r.json();
      })
      .then((data: Stats) => {
        let total = 0;
        Object.values(data.yearly || {}).forEach(y => {
          total += y.count;
        });
        setCount(total);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MetricCard label="Total Runs">
      {loading && <Loader size="sm" />}
      {!loading && error && <Text>{error}</Text>}
      {!loading && !error && <Text fw={700}>{count}</Text>}
    </MetricCard>
  );
}
