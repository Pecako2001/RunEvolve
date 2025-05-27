"use client";

import { Card, Loader, Stack, Text, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import MetricCard from "../MetricCard";
import { formatTime } from "../../utils/time";
import dynamic from "next/dynamic";

const IconRun = dynamic(
  () => import("@tabler/icons-react").then((m) => m.IconRun),
  { ssr: false },
);
const IconClock = dynamic(
  () => import("@tabler/icons-react").then((m) => m.IconClockHour4),
  { ssr: false },
);
const IconGauge = dynamic(
  () => import("@tabler/icons-react").then((m) => m.IconGauge),
  { ssr: false },
);
const IconHeart = dynamic(
  () => import("@tabler/icons-react").then((m) => m.IconHeartbeat),
  { ssr: false },
);

interface Run {
  id: number;
  name?: string | null;
  created_at: string;
  distance?: number | null;
  time?: number | null;
  average_speed?: number | null;
  heart_rate?: number | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LastRunCard() {
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/runs/last`)
      .then(async (r) => {
        if (!r.ok) {
          const data = await r
            .json()
            .catch(() => ({ detail: "Failed to fetch" }));
          throw new Error(data.detail);
        }
        return r.json();
      })
      .then((data: Run) => setRun(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MetricCard label="Last Run">
      {loading && <Loader size="sm" />}
      {!loading && error && <Text>{error}</Text>}
      {!loading && !error && run && (
        <Stack gap={4}>
          <Text fw={700}>{run.name || "Unnamed"}</Text>
          <Text className="text-dimmed">
            {new Date(run.created_at).toLocaleDateString()}
          </Text>
          <Group gap="xs">
            <IconRun size={16} />
            <Text>{run.distance?.toFixed(2) || "N/A"} km</Text>
          </Group>
          <Group gap="xs">
            <IconClock size={16} />
            <Text>{formatTime(run.time)}</Text>
          </Group>
          <Group gap="xs">
            <IconGauge size={16} />
            <Text>{run.average_speed?.toFixed(2) || "N/A"} km/h</Text>
          </Group>
          <Group gap="xs">
            <IconHeart size={16} />
            <Text>{run.heart_rate || "N/A"} bpm</Text>
          </Group>
        </Stack>
      )}
      {!loading && !error && !run && <Text>No runs found</Text>}
    </MetricCard>
  );
}
