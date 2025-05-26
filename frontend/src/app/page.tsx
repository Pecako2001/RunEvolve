'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Stack,
  Grid,
  Card,
  Text,
  Title,
  Loader,
  Alert,
  SimpleGrid,
  Paper,
  Group,
  RingProgress,
  Center,
} from '@mantine/core';
import { IconAlertCircle, IconRun, IconChartBar, IconCalendarStats, IconClockHour4, IconHeartbeat, IconGauge } from '@tabler/icons-react';

// Define interfaces for the data structures
interface Run {
  id: number;
  name: Optional<string>;
  created_at: string; // Assuming ISO string format
  distance: Optional<number>;
  time: Optional<number>; // in seconds
  average_speed: Optional<number>; // km/h
  heart_rate: Optional<number>; // bpm
  settings_snapshot: Optional<Record<string, any>>;
}

interface StatDetail {
  count: number;
  total_distance: number;
}

interface Stats {
  weekly: Record<string, StatDetail>;
  monthly: Record<string, StatDetail>;
  yearly: Record<string, StatDetail>;
}

// Helper to make properties optional for interfaces if needed
type Optional<T> = T | null | undefined;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to format time from seconds to HH:MM:SS or MM:SS
function formatTime(seconds: Optional<number>): string {
  if (seconds === null || seconds === undefined) return 'N/A';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Helper function to get current week key (e.g., "2023-W38")
function getCurrentWeekKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (now.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}


export default function Home() {
  const [lastRun, setLastRun] = useState<Run | null>(null);
  const [loadingLastRun, setLoadingLastRun] = useState(true);
  const [errorLastRun, setErrorLastRun] = useState<string | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  useEffect(() => {
    // Fetch last run
    fetch(`${API_BASE_URL}/runs/last`)
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch last run' }));
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Run) => {
        setLastRun(data);
        setErrorLastRun(null);
      })
      .catch((error) => {
        console.error('Error fetching last run:', error);
        setErrorLastRun(error.message || 'An unexpected error occurred');
        setLastRun(null); // Ensure no stale data is shown
      })
      .finally(() => {
        setLoadingLastRun(false);
      });

    // Fetch stats
    fetch(`${API_BASE_URL}/runs/stats`)
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch stats' }));
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Stats) => {
        setStats(data);
        setErrorStats(null);
      })
      .catch((error) => {
        console.error('Error fetching stats:', error);
        setErrorStats(error.message || 'An unexpected error occurred');
        setStats(null); // Ensure no stale data is shown
      })
      .finally(() => {
        setLoadingStats(false);
      });
  }, []);

  const currentWeekKey = getCurrentWeekKey();
  const weeklyStats = stats?.weekly?.[currentWeekKey] || { count: 0, total_distance: 0 };
  
  let totalRuns = 0;
  let totalDistanceAllTime = 0;
  let totalTimeAllTime = 0;

  if (stats) {
    Object.values(stats.yearly).forEach(yearStat => {
      totalRuns += yearStat.count;
      totalDistanceAllTime += yearStat.total_distance;
      // Note: Total time isn't directly available from stats endpoint,
      // this would require iterating all runs or enhancing the stats endpoint.
      // For average speed, we'd also need total time for all runs.
      // We can approximate average speed if the stats endpoint included total_time.
    });
  }
  
  // Calculate overall average speed if possible (requires total time for all runs, which is not in current stats)
  // For now, we'll display average speed from the last run if available.

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} mb="lg">Dashboard</Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Title order={3}>Last Run</Title>
                {loadingLastRun && <Loader size="sm" />}
              </Group>
              {errorLastRun && (
                <Alert title="Error" color="red" icon={<IconAlertCircle />}>
                  {errorLastRun}
                </Alert>
              )}
              {!loadingLastRun && !errorLastRun && lastRun && (
                <Stack>
                  <Text size="lg" fw={700}>{lastRun.name || 'Unnamed Run'}</Text>
                  <Text c="dimmed">Date: {new Date(lastRun.created_at).toLocaleDateString()}</Text>
                  <Group>
                    <IconRun size={20} /> <Text>Distance: {lastRun.distance?.toFixed(2) || 'N/A'} km</Text>
                  </Group>
                  <Group>
                    <IconClockHour4 size={20} /> <Text>Time: {formatTime(lastRun.time)}</Text>
                  </Group>
                  <Group>
                    <IconGauge size={20} /> <Text>Avg Speed: {lastRun.average_speed?.toFixed(2) || 'N/A'} km/h</Text>
                  </Group>
                  <Group>
                    <IconHeartRate size={20} /> <Text>Heart Rate: {lastRun.heart_rate || 'N/A'} bpm</Text>
                  </Group>
                </Stack>
              )}
              {!loadingLastRun && !errorLastRun && !lastRun && (
                <Text mt="md" ta="center" c="dimmed">No runs recorded yet. Go for your first run!</Text>
              )}
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Title order={3}>Activity Summary</Title>
                 {loadingStats && <Loader size="sm" />}
              </Group>
              {errorStats && (
                <Alert title="Error" color="red" icon={<IconAlertCircle />}>
                  {errorStats}
                </Alert>
              )}
              {!loadingStats && !errorStats && stats && (
                <SimpleGrid cols={2} spacing="lg">
                  <Paper p="md" shadow="xs" withBorder>
                    <Text size="xl" fw={700}>{weeklyStats.total_distance.toFixed(2)} km</Text>
                    <Text c="dimmed">This Week</Text>
                  </Paper>
                  <Paper p="md" shadow="xs" withBorder>
                    <Text size="xl" fw={700}>{weeklyStats.count}</Text>
                    <Text c="dimmed">Runs This Week</Text>
                  </Paper>
                  <Paper p="md" shadow="xs" withBorder>
                    <Text size="xl" fw={700}>{totalRuns}</Text>
                    <Text c="dimmed">Total Runs (All Time)</Text>
                  </Paper>
                   <Paper p="md" shadow="xs" withBorder>
                    <Text size="xl" fw={700}>{totalDistanceAllTime.toFixed(2)} km</Text>
                    <Text c="dimmed">Total Distance (All Time)</Text>
                  </Paper>
                </SimpleGrid>
              )}
              {!loadingStats && !errorStats && !stats && (
                 <Text mt="md" ta="center" c="dimmed">No statistics available yet.</Text>
              )}
            </Card>
          </Grid.Col>
        </Grid>
        
        {/* Placeholder for future charts or more detailed stats */}
        {/* 
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4}>Weekly Progress (Example)</Title>
          <Center>
            <RingProgress
              label={<Text size="xs" ta="center">Progress</Text>}
              sections={[{ value: (weeklyStats.total_distance / 50) * 100, color: 'teal' }]} // Example goal: 50km
            />
            <Text ml="md">Target: 50 km this week</Text>
          </Center>
        </Card>
        */}
      </Stack>
    </Container>
  );
}
