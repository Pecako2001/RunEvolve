"use client";

import React, { useEffect, useState } from "react";
import { Card, Text, Group, Box, Loader, Stack } from "@mantine/core";
import globalStyles from "../../styles/global.module.css";
import styles from "./HeartRateZonesCard.module.css";

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

const HeartRateZonesCard: React.FC = () => {
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
      .catch(() => {
        setError("No zones available");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className={`card-base ${globalStyles.cardHover}`}>
      <Text className="card-header">Heart Rate Zones</Text>
      {loading && <Loader data-testid="hrzones-loader" size="sm" />}
      {!loading && error && <Text>{error}</Text>}
      {!loading && !error && zones.length === 0 && (
        <Text>No zones available</Text>
      )}
      {!loading && !error && zones.length > 0 && (
        <Stack className={styles.container}>
          {zones.map((zone, idx) => (
            <Box
              key={idx}
              className={styles.zoneBar}
              style={{
                backgroundColor:
                  zoneColors[idx] || zoneColors[zoneColors.length - 1],
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
    </Card>
  );
};

export default HeartRateZonesCard;
