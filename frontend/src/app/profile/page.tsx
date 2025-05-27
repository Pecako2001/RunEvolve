'use client';

import React, { useState } from 'react'; // useState for mock Strava connection
import {
  Container,
  Title,
  Text,
  Paper,
  SimpleGrid,
  Stack,
  Group,
  Avatar,
  Badge,
  Divider,
  Button,
  Box,
} from '@mantine/core';
import styles from './Profile.module.css';

// Mock data
const mockUser = {
  name: 'Runner McRunFace',
  joinDate: 'January 2023',
  avatarUrl: 'https://example.com/avatar.png', // Replace with a real placeholder or leave empty for default
};

const mockRunSummaries = {
  totalRuns: 120,
  totalDistance: '1500 km',
  totalTime: '120h 30m',
};

const mockPersonalBests = [
  { label: 'Fastest 1km', value: '4:30' },
  { label: 'Fastest 5km', value: '25:00' },
  { label: 'Fastest 10km', value: '55:00' },
  { label: 'Longest Run', value: '21.1 km (Half Marathon)' },
];

export default function ProfilePage() {
  // Mock state for Strava connection
  const [isStravaConnected, setIsStravaConnected] = useState(false);

  const handleStravaConnect = () => {
    // In a real app, this would initiate OAuth flow
    setIsStravaConnected(!isStravaConnected); // Toggle for demo
  };

  return (
    <Container className={styles.profilePage__container}>
      <Title order={1} className={styles.profilePage__title}>
        User Profile
      </Title>

      {/* User Information Section */}
      <Paper className={styles.profilePage__sectionPaper}>
        <Group className={styles.profilePage__userInfo}>
          <Avatar src={mockUser.avatarUrl} alt={mockUser.name} size="xl" radius="xl" />
          <Stack gap="xs">
            <Title order={2} className={styles.profilePage__userName}>{mockUser.name}</Title>
            <Text className={styles.profilePage__joinDate}>Joined: {mockUser.joinDate}</Text>
          </Stack>
        </Group>
      </Paper>

      {/* Strava Integration Section */}
      <Paper className={`${styles.profilePage__sectionPaper} ${styles.profilePage__stravaSection}`}>
          <Group className={styles.profilePage__stravaStatusGroup}>
            <Title order={3} className={styles.profilePage__sectionHeader}>Strava Sync Status</Title>
            <Badge color={isStravaConnected ? 'green' : 'red'} size="lg">
              {isStravaConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed" mt="xs" mb="md">
            {isStravaConnected 
              ? "Your activities are automatically synced from Strava."
              : "Connect your Strava account to automatically sync your runs."}
          </Text>
          {!isStravaConnected && (
            <Button size="sm" onClick={handleStravaConnect}>
              Connect to Strava
            </Button>
          )}
          {isStravaConnected && (
            <Button size="sm" variant="outline" color="red" onClick={handleStravaConnect}>
              Disconnect Strava
            </Button>
          )}
      </Paper>

      {/* Run Summaries Section */}
      <Paper className={styles.profilePage__sectionPaper}>
        <Title order={3} className={styles.profilePage__sectionHeader}>Run Summaries</Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Box className={styles.profilePage__summaryCard}>
            <Text className={styles.profilePage__summaryValue}>{mockRunSummaries.totalRuns}</Text>
            <Text className={styles.profilePage__summaryLabel}>Total Runs</Text>
          </Box>
          <Box className={styles.profilePage__summaryCard}>
            <Text className={styles.profilePage__summaryValue}>{mockRunSummaries.totalDistance}</Text>
            <Text className={styles.profilePage__summaryLabel}>Total Distance</Text>
          </Box>
          <Box className={styles.profilePage__summaryCard}>
            <Text className={styles.profilePage__summaryValue}>{mockRunSummaries.totalTime}</Text>
            <Text className={styles.profilePage__summaryLabel}>Total Time Spent Running</Text>
          </Box>
        </SimpleGrid>
      </Paper>

      {/* Personal Bests Section */}
      <Paper className={styles.profilePage__sectionPaper}>
        <Title order={3} className={styles.profilePage__sectionHeader}>Personal Bests</Title>
        <Stack gap="sm">
          {mockPersonalBests.map((pb) => (
            <Group key={pb.label} justify="space-between" className={styles.profilePage__pbItem}>
              <Text className={styles.profilePage__pbLabel}>{pb.label}:</Text>
              <Text>{pb.value}</Text>
            </Group>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}
