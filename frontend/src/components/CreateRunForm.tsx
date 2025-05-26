"use client";

import React, { useState } from 'react';
import { Card, TextInput, Button, Notification, Stack, Text } from '@mantine/core';
import axios from 'axios';
import styles from './CreateRunForm.module.css';

interface RunResponse {
  id: number;
  name: string | null;
  created_at: string; // Assuming ISO string format
  copied_from: number | null;
  settings_snapshot: any;
}

interface NotificationState {
  message: string;
  color: 'green' | 'red';
}

export default function CreateRunForm() {
  const [runName, setRunName] = useState(''); // Local state, not sent to backend for now
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setNotification(null);

    try {
      // The backend endpoint POST /runs/new-from-last does not currently accept a body.
      // It creates a new run by copying the settings from the most recent previous run.
      const response = await axios.post<RunResponse>('http://localhost:8000/runs/new-from-last', {});
      
      setNotification({
        message: `New run created successfully! ID: ${response.data.id}. Name: ${response.data.name || 'N/A'}`,
        color: 'green',
      });
      // Optionally, clear the runName input if it were being used
      // setRunName(''); 
    } catch (error) {
      let errorMessage = 'Failed to create run.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Failed to create run: ${error.response.data.detail || error.message}`;
      } else if (error instanceof Error) {
        errorMessage = `Failed to create run: ${error.message}`;
      }
      setNotification({
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.createRunForm__card}>
      <Stack>
        <TextInput
          label="Run Name (Optional)"
          placeholder="Enter a name for this run"
          value={runName}
          onChange={(event) => setRunName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <Text className={styles.createRunForm__noteText}>
          Note: The run name is currently for local reference and not sent to the backend with this action.
          The new run will inherit its name from the previous run.
        </Text>
        
        {notification && (
          <Notification
            color={notification.color}
            onClose={() => setNotification(null)}
            title={notification.color === 'green' ? 'Success' : 'Error'}
          >
            {notification.message}
          </Notification>
        )}

        <Button
          onClick={handleSubmit}
          loading={isLoading}
          className={styles.createRunForm__submitButton}
        >
          Create Run From Last
        </Button>
      </Stack>
    </Card>
  );
}
