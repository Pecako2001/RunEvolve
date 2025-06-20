import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import { lightColors, darkColors } from "../theme";
import { useTheme } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";
import Svg, { Polyline, Rect } from "react-native-svg";
import styles from "../styles/StatisticsScreenStyles";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

type Optional<T> = T | null | undefined;

interface Run {
  id: number;
  name: Optional<string>;
  created_at: string;
  distance: Optional<number>;
  time: Optional<number>;
  average_speed: Optional<number>;
  heart_rate: Optional<number>;
  settings_snapshot: Optional<Record<string, any>>;
  status: Optional<string>;
}

function formatTime(seconds: Optional<number>): string {
  if (seconds === null || seconds === undefined) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function StatisticsScreen() {
  // Use theme context or fallback to lightColors
  const { colors: themeColorsFromContext, isDark } = useContext(ThemeContext) || {};
  const colors = isDark ? darkColors : lightColors;

  const accent = colors.accent;
  const [completedRuns, setCompletedRuns] = useState<Run[]>([]);
  const [plannedRuns, setPlannedRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRuns() {
      try {
        const [completedResp, plannedResp] = await Promise.all([
          fetch(`${API_BASE_URL}/runs`),
          fetch(`${API_BASE_URL}/runs/planned`),
        ]);
        if (completedResp.ok) {
          setCompletedRuns(await completedResp.json());
        }
        if (plannedResp.ok) {
          setPlannedRuns(await plannedResp.json());
        }
      } catch (e) {
        console.error("failed to fetch runs", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRuns();
  }, []);

  const monthlyAvgSpeedData = completedRuns
    .reduce(
      (acc, run) => {
        if (!run.created_at || run.average_speed == null) return acc;
        const monthYear = new Date(run.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
        const entry = acc.find((r) => r.month === monthYear);
        if (entry) {
          entry.totalSpeed += run.average_speed!;
          entry.count += 1;
          entry.avgSpeed = entry.totalSpeed / entry.count;
        } else {
          acc.push({
            month: monthYear,
            totalSpeed: run.average_speed!,
            count: 1,
            avgSpeed: run.average_speed!,
          });
        }
        return acc;
      },
      [] as {
        month: string;
        totalSpeed: number;
        count: number;
        avgSpeed: number;
      }[],
    )
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .map((item) => ({
      month: item.month,
      avgSpeed: parseFloat(item.avgSpeed.toFixed(2)),
    }));

  const yearlyDistanceData = completedRuns
    .reduce(
      (acc, run) => {
        if (!run.created_at || run.distance == null) return acc;
        const year = new Date(run.created_at).getFullYear().toString();
        const entry = acc.find((r) => r.year === year);
        if (entry) {
          entry.totalDistance += run.distance!;
        } else {
          acc.push({ year, totalDistance: run.distance! });
        }
        return acc;
      },
      [] as { year: string; totalDistance: number }[],
    )
    .sort((a, b) => parseInt(a.year) - parseInt(b.year))
    .map((item) => ({
      year: item.year,
      totalDistance: parseFloat(item.totalDistance.toFixed(2)),
    }));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Run Statistics</Text>

        <Text style={styles.sectionTitle}>Average Speed per Month</Text>
        <LineChart data={monthlyAvgSpeedData} accent={accent} />

        <Text style={styles.sectionTitle}>Total Distance per Year</Text>
        <BarChart data={yearlyDistanceData} accent={accent} />

        <Text style={styles.sectionTitle}>Completed Runs</Text>
        {completedRuns.map((run) => (
          <View key={run.id} style={styles.row}>
            <Text style={styles.cell}>{run.name || "Unnamed Run"}</Text>
            <Text style={styles.cell}>
              {new Date(run.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.cell}>
              {run.distance?.toFixed(2) || "N/A"} km
            </Text>
            <Text style={styles.cell}>{formatTime(run.time)}</Text>
            <Text style={styles.cell}>
              {run.average_speed?.toFixed(2) || "N/A"} km/h
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Planned Runs</Text>
        {plannedRuns.map((run) => (
          <View key={run.id} style={styles.row}>
            <Text style={styles.cell}>{run.name || "Unnamed Planned Run"}</Text>
            <Text style={styles.cell}>
              {new Date(run.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.cell}>
              {run.distance?.toFixed(2) || "N/A"} km
            </Text>
            <Text style={styles.cell}>{formatTime(run.time)}</Text>
          </View>
        ))}

        {loading && <Text>Loading...</Text>}
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

function LineChart({ data, accent }: { data: { month: string; avgSpeed: number }[]; accent: string }) {
  if (data.length === 0) return <Text>No data</Text>;
  const width = 300;
  const height = 150;
  const maxY = Math.max(...data.map((d) => d.avgSpeed));
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 40) + 20;
      const y = height - (d.avgSpeed / maxY) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <Svg width={width} height={height} style={styles.chart}>
      <Polyline
        points={points}
        fill="none"
        stroke={accent}
        strokeWidth={2}
      />
    </Svg>
  );
}

function BarChart({
  data,
  accent,
}: {
  data: { year: string; totalDistance: number }[];
  accent: string;
}) {
  if (data.length === 0) return <Text>No data</Text>;
  const width = 300;
  const height = 150;
  const maxY = Math.max(...data.map((d) => d.totalDistance));
  const barWidth = (width - 40) / data.length;
  return (
    <Svg width={width} height={height} style={styles.chart}>
      {data.map((d, i) => {
        const barHeight = (d.totalDistance / maxY) * (height - 20);
        return (
          <Rect
            key={i}
            x={20 + i * barWidth}
            y={height - barHeight - 10}
            width={barWidth - 4}
            height={barHeight}
            fill={accent}
          />
        );
      })}
    </Svg>
  );
}

