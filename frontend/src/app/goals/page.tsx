'use client';

import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Paper,
  SimpleGrid,
  Select,
  Progress,
  Box, // Added Box for potentially more layout control
} from '@mantine/core';
import styles from './Goals.module.css';

interface Goal {
  id: string;
  type: 'Weekly' | 'Monthly';
  targetDistance?: number;
  currentTargetDistance?: number;
  targetTime?: number; // in minutes
  currentTargetTime?: number; // in minutes
  description?: string;
}

const mockGoals: Goal[] = [
  { id: '1', type: 'Weekly', targetDistance: 50, currentTargetDistance: 25, description: "Run 50km this week" },
  { id: '2', type: 'Monthly', targetTime: 600, currentTargetTime: 300, description: "Run 600 minutes this month" },
  { id: '3', type: 'Weekly', targetDistance: 30, currentTargetDistance: 10, targetTime: 180, currentTargetTime: 60, description: "Weekly distance and time goal" },
  { id: '4', type: 'Monthly', targetDistance: 200, currentTargetDistance: 150, description: "Monthly long distance challenge" },
];

export default function GoalsPage() {
  // Basic state for form inputs - can be expanded later for actual logic
  const [goalDistance, setGoalDistance] = useState('');
  const [goalTime, setGoalTime] = useState('');
  const [goalType, setGoalType] = useState<'Weekly' | 'Monthly' | null>(null);

  const handleAddGoal = () => {
    console.log('Adding new goal:', {
      distance: goalDistance,
      time: goalTime,
      type: goalType,
    });
    // Here you would typically clear the form or send data to a backend
    setGoalDistance('');
    setGoalTime('');
    setGoalType(null);
  };

  const calculateProgress = (current?: number, target?: number) => {
    if (target === undefined || target === 0 || current === undefined) return 0;
    return Math.min((current / target) * 100, 100);
  };

  return (
    <Container className={styles.goalsPage__container}>
      <Title order={1} className={styles.goalsPage__title}>
        Track Your Goals
      </Title>

      {/* Set New Goal Section */}
      <Paper className={styles.goalsPage__formPaper}>
        <Title order={3} className={styles.goalsPage__sectionTitle} mb="lg">Set New Goal</Title>
        <Stack gap="md">
          <TextInput
            type="number"
            label="Goal Distance (km)"
            placeholder="Enter target distance in kilometers"
            value={goalDistance}
            onChange={(event) => setGoalDistance(event.currentTarget.value)}
          />
          <TextInput
            type="number"
            label="Goal Time (minutes)"
            placeholder="Enter target time in minutes"
            value={goalTime}
            onChange={(event) => setGoalTime(event.currentTarget.value)}
          />
          <Select
            label="Goal Type"
            data={['Weekly', 'Monthly']}
            placeholder="Select goal frequency"
            value={goalType}
            onChange={(value) => setGoalType(value as 'Weekly' | 'Monthly' | null)}
          />
          <Button onClick={handleAddGoal} mt="md">
            Add Goal
          </Button>
        </Stack>
      </Paper>

      {/* Current Goals Section */}
      <Title order={3} className={styles.goalsPage__sectionTitle} mb="lg" mt="xl">Current Goals</Title>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing="lg"
        className={styles.goalsPage__goalCardsGrid}
      >
        {mockGoals.map((goal) => {
          const progressValue = goal.targetDistance 
            ? calculateProgress(goal.currentTargetDistance, goal.targetDistance)
            : calculateProgress(goal.currentTargetTime, goal.targetTime);
          
          const progressLabel = goal.targetDistance
            ? `${goal.currentTargetDistance || 0} / ${goal.targetDistance} km`
            : `${goal.currentTargetTime || 0} / ${goal.targetTime} min`;

          return (
            <Paper key={goal.id} className={styles.goalsPage__goalCard}>
              <Title order={4} className={styles.goalsPage__goalCardTitle}>
                {goal.type} Goal
              </Title>
              <Text className={styles.goalsPage__goalDetailText}>
                {goal.description || (goal.targetDistance ? `Target: ${goal.targetDistance} km` : `Target: ${goal.targetTime} minutes`)}
              </Text>
              
              {goal.targetDistance !== undefined && (
                <Box>
                  <Text size="sm">Distance: {goal.currentTargetDistance || 0} / {goal.targetDistance} km</Text>
                  <Progress 
                    value={calculateProgress(goal.currentTargetDistance, goal.targetDistance)} 
                    label={`${calculateProgress(goal.currentTargetDistance, goal.targetDistance).toFixed(0)}%`} 
                    className={styles.goalsPage__goalProgress} 
                    size="lg"
                    striped 
                    animated={calculateProgress(goal.currentTargetDistance, goal.targetDistance) < 100}
                  />
                </Box>
              )}

              {goal.targetTime !== undefined && (
                 <Box mt={goal.targetDistance !== undefined ? "sm" : undefined}>
                  <Text size="sm">Time: {goal.currentTargetTime || 0} / {goal.targetTime} min</Text>
                  <Progress 
                    value={calculateProgress(goal.currentTargetTime, goal.targetTime)} 
                    label={`${calculateProgress(goal.currentTargetTime, goal.targetTime).toFixed(0)}%`} 
                    className={styles.goalsPage__goalProgress}
                    color="teal"
                    size="lg"
                    striped
                    animated={calculateProgress(goal.currentTargetTime, goal.targetTime) < 100}
                  />
                </Box>
              )}

              {goal.targetDistance === undefined && goal.targetTime === undefined && (
                <Text c="dimmed" size="sm">No specific target set for this goal type.</Text>
              )}
            </Paper>
          );
        })}
      </SimpleGrid>
    </Container>
  );
}
