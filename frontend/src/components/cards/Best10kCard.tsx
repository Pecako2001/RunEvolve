"use client";

import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import MetricCard from "../cards/MetricCard";
import { formatTime } from "../../utils/time";

interface Run {
  distance?: number | null;
  time?: number | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Best10kCard() {
  const [best, setBest] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/runs?limit=1000`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch runs");
        return r.json();
      })
      .then((runs: Run[]) => {
        let min: number | null = null;
        runs.forEach(run => {
          if (
            run.distance &&
            run.time &&
            run.distance >= 9.5 &&
            run.distance <= 10.5
          ) {
            if (min === null || run.time < min) min = run.time;
          }
        });
        setBest(min);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MetricCard label="Best 10k">
      {loading && <Loader size="sm" />}
      {!loading && error && <Text>{error}</Text>}
      {!loading && !error && best !== null && <Text fw={700}>{formatTime(best)}</Text>}
      {!loading && !error && best === null && <Text>N/A</Text>}
    </MetricCard>
  );
}
