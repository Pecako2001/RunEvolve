"use client";

import { useState } from "react";
import {
  Card,
  Title,
  Text,
  Loader,
  Alert,
  Button,
  Select,
  NumberInput,
  Group,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NetworkPage() {
  const [runType, setRunType] = useState<string | null>(null);
  const [distance, setDistance] = useState<number>();
  const [planning, setPlanning] = useState<{
    run_type: string;
    training_plan: {
      type: string;
      description: string;
      recommended: {
        distance: number;
        time: number;
        average_speed: number;
      };
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelMsg, setModelMsg] = useState<string | null>(null);

  const fetchCustomPlan = async () => {
    if (!runType) {
      setError("Please select a run type");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/network/plan/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run_type: runType, distance }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to generate training plan");
      }
      const data = await res.json();
      console.log("API Response:", data); // Debug log
      setPlanning(data);
    } catch (e: any) {
      setError(e.message || "Failed to generate training plan");
    }
    setLoading(false);
  };

  const retrainModel = async () => {
    setLoading(true);
    setError(null);
    setModelMsg(null);
    try {
      const res = await fetch(`${API}/network/train`, { method: "POST" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail || "Unknown error");
      setModelMsg(j.detail);
      notifications.show({
        title: "Model Updated",
        message: j.detail,
        color: "green",
      });
    } catch (e: any) {
      const msg = `Retrain failed: ${e.message}`;
      setError(msg);
      notifications.show({
        title: "Training Failed",
        message: msg,
        color: "red",
      });
    }
    setLoading(false);
  };

  return (
    <Card shadow="md" p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={2}>Network & AI</Title>
        <Button onClick={retrainModel} color="orange" loading={loading}>
          Update Model
        </Button>
        {modelMsg && <Alert color="green">{modelMsg}</Alert>}
        {error && <Alert color="red">{error}</Alert>}

        <Select
          label="Run Type"
          placeholder="Select one"
          data={["Interval", "Tempo Run", "Long Run", "Easy/Recovery Run"]}
          value={runType}
          onChange={setRunType}
        />

        {(runType === "Long Run" || runType === "Easy/Recovery Run") && (
          <NumberInput
            label="Distance (km)"
            value={distance}
            onChange={(val) =>
              setDistance(typeof val === "number" ? val : undefined)
            }
            decimalScale={1}
            min={0}
          />
        )}

        <Button onClick={fetchCustomPlan} color="blue" loading={loading}>
          Generate Plan
        </Button>

        {planning && planning.training_plan && (
          <Card shadow="sm" p="md">
            <Text fw={600}>Run Type: {planning.run_type}</Text>
            <Text mt="sm" fw={500}>
              {planning.training_plan.description}
            </Text>
            <Text mt="sm">
              Recommended:
              <ul>
                <li>
                  Distance:{" "}
                  {planning.training_plan.recommended.distance.toFixed(1)} km
                </li>
                <li>
                  Time:{" "}
                  {Math.round(planning.training_plan.recommended.time / 60)}{" "}
                  minutes
                </li>
                <li>
                  Average Speed:{" "}
                  {planning.training_plan.recommended.average_speed.toFixed(1)}{" "}
                  km/h
                </li>
              </ul>
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  );
}
