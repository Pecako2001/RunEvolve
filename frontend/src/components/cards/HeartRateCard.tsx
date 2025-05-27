"use client";

import { Card, Loader, Text, Group, Box, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import MetricCard from "../cards/MetricCard";

interface Zone {
  min: number;
  max: number;
}

interface ZonesResponse {
  heart_rate?: {
    zones: Zone[];
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const zoneColors = ["#00bcd4", "#4caf50", "#ffeb3b", "#ff9800", "#f44336"];

export default function HeartRateCard() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No zones available");
      setLoading(false);
      return;
    }
    fetch(`${API_BASE_URL}/strava/athlete/zones`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch zones");
        return r.json();
      })
      .then((data: ZonesResponse) => {
        setZones(data.heart_rate?.zones || []);
      })
      .catch(() => setError("No zones available"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MetricCard label="Heart Rate Zones">
      {loading && <Loader size="sm" />}
      {!loading && error && <Text>{error}</Text>}
      {!loading && !error && zones.length === 0 && (
        <Text>No zones available</Text>
      )}
      {!loading && !error && zones.length > 0 && (
        <Stack>
          {zones.map((zone, idx) => (
            <Box
              key={idx}
              style={{
                backgroundColor:
                  zoneColors[idx] || zoneColors[zoneColors.length - 1],
                borderRadius: 4,
                padding: "0.25rem",
                color: "#000",
              }}
            >
              <Group justify="space-between">
                <Text fw={500}>Zone {idx + 1}</Text>
                <Text>
                  {zone.min} - {zone.max === -1 ? "∞" : zone.max} bpm
                </Text>
              </Group>
            </Box>
          ))}
        </Stack>
      )}
    </MetricCard>
  );
}
