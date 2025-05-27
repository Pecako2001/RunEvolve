'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Stack,
  Title,
  Paper,
  Loader,
  Alert,
  Table,
  Text,
  Grid,
  Group,
  ScrollArea,
} from '@mantine/core';
import styles from './Statistics.module.css'; // Import CSS module
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
} from 'recharts';
import { IconAlertCircle } from '@tabler/icons-react';

// Define interfaces for the data structures (consistent with home page)
type Optional<T> = T | null | undefined;

interface Run {
  id: number;
  name: Optional<string>;
  created_at: string; // ISO string format
  distance: Optional<number>; // km
  time: Optional<number>; // seconds
  average_speed: Optional<number>; // km/h
  heart_rate: Optional<number>; // bpm
  settings_snapshot: Optional<Record<string, any>>;
}

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

export default function StatisticsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null); // Reset error on new fetch attempt

    fetch(`${API_BASE_URL}/runs`)
      .then(async (response) => {
        if (!response.ok) {
          // Try to parse error message from backend if available
          const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch runs data.' }));
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Run[]) => {
        setRuns(data);
        if (data.length === 0) {
          // You might want to set a specific message or handle this in the UI differently
          console.log("No runs found from the backend.");
        }
      })
      .catch((err) => {
        console.error('Error fetching runs:', err);
        setError(err.message || 'An unexpected error occurred while fetching run data.');
        setRuns([]); // Clear runs on error to avoid showing stale data
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Data transformation for charts
  // This logic should be robust enough, assuming the Run interface matches backend
  const monthlyAvgSpeedData = runs.reduce((acc, run) => {
    if (!run.created_at || run.average_speed === null || run.average_speed === undefined) return acc;
    const monthYear = new Date(run.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const existingEntry = acc.find(entry => entry.month === monthYear);
    if (existingEntry) {
      existingEntry.totalSpeed += run.average_speed;
      existingEntry.count += 1;
      existingEntry.avgSpeed = existingEntry.totalSpeed / existingEntry.count;
    } else {
      acc.push({ month: monthYear, totalSpeed: run.average_speed, count: 1, avgSpeed: run.average_speed });
    }
    return acc;
  }, [] as { month: string; totalSpeed: number; count: number; avgSpeed: number }[])
  .sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime()) // Sort by date
  .map(item => ({month: item.month, avgSpeed: parseFloat(item.avgSpeed.toFixed(2))}));


  const yearlyDistanceData = runs.reduce((acc, run) => {
    if (!run.created_at || run.distance === null || run.distance === undefined) return acc;
    const year = new Date(run.created_at).getFullYear().toString();
    const existingEntry = acc.find(entry => entry.year === year);
    if (existingEntry) {
      existingEntry.totalDistance += run.distance;
    } else {
      acc.push({ year, totalDistance: run.distance });
    }
    return acc;
  }, [] as { year: string; totalDistance: number }[])
  .sort((a,b) => parseInt(a.year) - parseInt(b.year)) // Sort by year
  .map(item => ({year: item.year, totalDistance: parseFloat(item.totalDistance.toFixed(2))}));


  if (loading) {
    return (
      <Container fluid className={styles.statisticsPage__container}>
        <Stack className={styles.statisticsPage__loadingStack}>
          <Loader size="xl" /> {/* Mantine Loader size prop is fine */}
          <Text>Loading statistics...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className={styles.statisticsPage__container}>
        <Alert title="Error Fetching Run Data" color="red" icon={<IconAlertCircle />}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (runs.length === 0 && !loading && !error) { // Added !error condition here
    return (
      <Container fluid className={styles.statisticsPage__container}>
        <Title order={2} className={styles.statisticsPage__mainTitle}>Run Statistics</Title>
        <Text>No run data available to display statistics. Try creating some runs first!</Text>
      </Container>
    );
  }

  const tableRows = runs.map((run) => (
    <Table.Tr key={run.id}>
      <Table.Td>{run.name || 'Unnamed Run'}</Table.Td>
      <Table.Td>{new Date(run.created_at).toLocaleDateString()}</Table.Td>
      <Table.Td>{run.distance?.toFixed(2) || 'N/A'} km</Table.Td>
      <Table.Td>{formatTime(run.time)}</Table.Td>
      <Table.Td>{run.average_speed?.toFixed(2) || 'N/A'} km/h</Table.Td>
      <Table.Td>{run.heart_rate || 'N/A'} bpm</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container fluid className={styles.statisticsPage__container}>
      <Stack className={styles.statisticsPage__contentStack}>
        <Title order={2} className={styles.statisticsPage__mainTitle}>Run Statistics</Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper className={styles.statisticsPage__chartPaper}>
              <Title order={4} className={styles.statisticsPage__paperTitle}>Average Speed per Month</Title>
              {monthlyAvgSpeedData.length > 0 ? (
                <Group className={styles.statisticsPage__chartGroup}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyAvgSpeedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: 'Avg Speed (km/h)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgSpeed" stroke="#8884d8" activeDot={{ r: 8 }} name="Avg Speed" />
                    </LineChart>
                  </ResponsiveContainer>
                </Group>
              ) : (
                <Text>Not enough data for monthly average speed chart.</Text>
              )}
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper className={styles.statisticsPage__chartPaper}>
              <Title order={4} className={styles.statisticsPage__paperTitle}>Total Distance per Year</Title>
              {yearlyDistanceData.length > 0 ? (
               <Group className={styles.statisticsPage__chartGroup}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyDistanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Total Distance (km)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalDistance" fill="#82ca9d" name="Total Distance" />
                  </BarChart>
                </ResponsiveContainer>
              </Group>
              ) : (
                <Text className={styles.statisticsPage__noDataText}>
                  Not enough data for yearly total distance chart.
                </Text>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
        
        <Paper className={styles.statisticsPage__tablePaper}>
          <Title order={4} className={styles.statisticsPage__paperTitle}>All Runs</Title>
          <ScrollArea>
            <Table 
              className={`${styles.statisticsPage__runsTable} ${styles.statisticsPage__runsTable_striped} ${styles.statisticsPage__runsTable_highlightOnHover} ${styles.statisticsPage__runsTable_withTableBorder} ${styles.statisticsPage__runsTable_withColumnBorders}`}
              miw={600}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Distance</Table.Th>
                  <Table.Th>Time</Table.Th>
                  <Table.Th>Avg Speed</Table.Th>
                  <Table.Th>Heart Rate</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{tableRows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Stack>
    </Container>
  );
}
