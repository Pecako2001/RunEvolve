'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stack,
  Card,
  Text,
  Title,
  Loader,
  Alert,
  SimpleGrid,
  Paper,
  Group,
} from '@mantine/core';
import dynamic from 'next/dynamic';

const IconAlertCircle = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconAlertCircle),
  { ssr: false }
);
const IconRun = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconRun),
  { ssr: false }
);
const IconChartBar = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconChartBar),
  { ssr: false }
);
const IconCalendarStats = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconCalendarStats),
  { ssr: false }
);
const IconClockHour4 = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconClockHour4),
  { ssr: false }
);
const IconHeartbeat = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconHeartbeat),
  { ssr: false }
);
const IconGauge = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconGauge),
  { ssr: false }
);
import globalStyles from '../styles/global.module.css';

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
  const router = useRouter();
  const [lastRun, setLastRun] = useState<Run | null>(null);
  const [loadingLastRun, setLoadingLastRun] = useState(true);
  const [errorLastRun, setErrorLastRun] = useState<string | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    fetch(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error('auth');
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.replace('/login');
      });
  }, [router]);

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
    <div className="page-container">
      <Stack className="content-stack">
        <Title order={2} className="page-title">Run Overview</Title>
        
        <Card className={`card-base ${globalStyles.cardHover}`}>
          <Group className="card-header">
            <Text className="text-large">Current Run</Text>
            {loadingLastRun && <Loader size="sm" />}
          </Group>
          {errorLastRun && (
            <Alert title="Error" color="red" icon={<IconAlertCircle />}>
              {errorLastRun}
            </Alert>
          )}
          {!loadingLastRun && !errorLastRun && lastRun && (
            <Stack>
              <Text className="text-large">{lastRun.name || 'Unnamed Run'}</Text>
              <Text className="text-dimmed">Date: {new Date(lastRun.created_at).toLocaleDateString()}</Text>
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
                <IconHeartbeat size={20} /> <Text>Heart Rate: {lastRun.heart_rate || 'N/A'} bpm</Text>
              </Group>
            </Stack>
          )}
          {!loadingLastRun && !errorLastRun && !lastRun && (
            <Text className="empty-state">No runs recorded yet. Go for your first run!</Text>
          )}
        </Card>
        
        <Paper className={`card-base ${globalStyles.cardHover}`}>
          <Text className="text-dimmed">Statistics</Text>
          {loadingStats && <Loader size="sm" />}
          {errorStats && (
            <Alert title="Error" color="red" icon={<IconAlertCircle />}>
              {errorStats}
            </Alert>
          )}
          {!loadingStats && !errorStats && stats && (
            <SimpleGrid cols={2} spacing="lg">
              {/* Applying cardHover to inner Paper elements as well for consistency */}
              <Paper className={`card-base ${globalStyles.cardHover}`}>
                <Text size="xl" fw={700}>{weeklyStats.total_distance.toFixed(2)} km</Text>
                <Text className="text-dimmed">This Week</Text>
              </Paper>
              <Paper className={`card-base ${globalStyles.cardHover}`}>
                <Text size="xl" fw={700}>{weeklyStats.count}</Text>
                <Text className="text-dimmed">Runs This Week</Text>
              </Paper>
              <Paper className={`card-base ${globalStyles.cardHover}`}>
                <Text size="xl" fw={700}>{totalRuns}</Text>
                <Text className="text-dimmed">Total Runs (All Time)</Text>
              </Paper>
              <Paper className={`card-base ${globalStyles.cardHover}`}>
                <Text size="xl" fw={700}>{totalDistanceAllTime.toFixed(2)} km</Text>
                <Text className="text-dimmed">Total Distance (All Time)</Text>
              </Paper>
            </SimpleGrid>
          )}
          {!loadingStats && !errorStats && !stats && (
            <Text className="empty-state">No statistics available yet.</Text>
          )}
        </Paper>
        
        {/* Placeholder for future charts or more detailed stats */}
        {/* 
        <Card className={styles.home__infoCard}>
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
    </div>
  );
}
