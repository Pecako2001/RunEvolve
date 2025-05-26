"use client";

import React, { useState } from 'react';
import { TextInput, Button, Stack, Text, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

interface RunResponse {
  id: number;
  name: string | null;
  created_at: string; // Assuming ISO string format
  copied_from: number | null;
  settings_snapshot: any;
}

export default function CreateRunForm() {
  const [runName, setRunName] = useState(''); // Local state, not sent to backend for now
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isLoading for clarity

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // The backend endpoint POST /runs/new-from-last does not currently accept a body.
      // It creates a new run by copying the settings from the most recent previous run.
      const response = await axios.post<RunResponse>('http://localhost:8000/runs/new-from-last', {});
      
      notifications.show({
        title: 'Success',
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
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="createRunForm__card">
      <Stack>
        <TextInput
          label="Run Name (Optional)"
          placeholder="Enter a name for this run"
          value={runName}
          onChange={(event) => setRunName(event.currentTarget.value)}
          disabled={isSubmitting}
        />
        <Text className="createRunForm__noteText">
          Note: The run name is currently for local reference and not sent to the backend with this action.
          The new run will inherit its name from the previous run.
        </Text>
        
        {/* Notification component removed, will use Mantine's global notifications */}

        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          className="createRunForm__submitButton buttonHoverActive" // Added buttonHoverActive
        >
          Create Run From Last
        </Button>
      </Stack>
    </Box>
  );
}
