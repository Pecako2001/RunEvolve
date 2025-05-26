"use client";

import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Loader, Alert, Card, Stack, Group } from '@mantine/core';
import axios from 'axios';
import CreateRunForm from '@/components/CreateRunForm'; // Assuming alias @ is setup for src
import styles from './CreateRun.module.css'; // Import CSS module

// 1. Define Run Interface
interface Run {
  id: number;
  name: string | null;
  created_at: string; // ISO string format from backend
  copied_from: number | null;
  settings_snapshot: any; // Can be more specific if the structure is known
}

export default function CreateRunPage() {
  // 2. State variables
  const [lastRun, setLastRun] = useState<Run | null>(null);
  const [isLoadingLastRun, setIsLoadingLastRun] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 3. useEffect to fetch last run data
  useEffect(() => {
    const fetchLastRun = async () => {
      setIsLoadingLastRun(true);
      setFetchError(null);
      try {
        const response = await axios.get<Run>('http://localhost:8000/runs/last');
        setLastRun(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setFetchError("No previous run data available to preview."); // Graceful handling of 404
          setLastRun(null); // Ensure lastRun is null if not found
        } else if (error instanceof Error) {
          setFetchError(`Error fetching last run: ${error.message}`);
        } else {
          setFetchError('An unknown error occurred while fetching the last run.');
        }
      } finally {
        setIsLoadingLastRun(false);
      }
    };

    fetchLastRun();
  }, []);

  return (
    <Container className={styles.createRunPage__pageContainer}>
      <Title order={1} className={styles.createRunPage__mainTitle}>
        Create New Run
      </Title>

      {/* 4. Display Last Run Data (Preview) */}
      <Title order={2} size="h3" className={styles.createRunPage__subTitle}>Preview Previous Run</Title>
      {isLoadingLastRun && (
        <Group className={styles.createRunPage__loaderGroup}>
          <Loader />
          <Text>Loading previous run details...</Text>
        </Group>
      )}
      
      {!isLoadingLastRun && fetchError && !lastRun && ( // Show error only if no data to display from a previous successful fetch
        <Alert title="Fetch Error" color="red" withCloseButton onClose={() => setFetchError(null)} className={styles.createRunPage__errorAlert}>
          {fetchError}
        </Alert>
      )}

      {!isLoadingLastRun && !fetchError && !lastRun && (
         <Text className={styles.createRunPage__infoText}>No previous run data available to preview.</Text>
      )}

      {lastRun && (
        <Card className={styles.createRunPage__previewCard}>
          <Stack>
            <Title order={3} size="h4">Previous Run Details</Title>
            <Text><strong>ID:</strong> {lastRun.id}</Text>
            <Text><strong>Name:</strong> {lastRun.name || 'N/A'}</Text>
            <Text><strong>Created At:</strong> {new Date(lastRun.created_at).toLocaleString()}</Text>
            {lastRun.settings_snapshot && (
              <Text className={styles.createRunPage__snapshotText}>
                <strong>Settings Snapshot:</strong> <pre>{JSON.stringify(lastRun.settings_snapshot, null, 2)}</pre>
              </Text>
            )}
            {lastRun.copied_from !== null && (
                 <Text><strong>Copied From Run ID:</strong> {lastRun.copied_from}</Text>
            )}
          </Stack>
        </Card>
      )}
      
      {/* Render CreateRunForm */}
      <Title order={2} size="h3" className={`${styles.createRunPage__subTitle} ${styles.createRunPage__subTitle_marginTopXl}`}>Create New Run</Title>
      <div className={styles.createRunPage__formSection}>
        <CreateRunForm />
      </div>
    </Container>
  );
}
