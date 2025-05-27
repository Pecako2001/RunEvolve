import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CreateRunForm from '../forms/CreateRunForm';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Mantine's Notification component to simplify testing its presence/absence
// Or ensure your tests can find elements within it if it's more complex.
// For simplicity, we'll just check for text rendered by the Notification.

describe('CreateRunForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockedAxios.post.mockClear();
    mockedAxios.get.mockClear(); // Though not used directly in this component
  });

  test('renders the form with input and button', () => {
    render(<CreateRunForm />);
    
    expect(screen.getByLabelText(/Run Name \(Optional\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Run From Last/i })).toBeInTheDocument();
    expect(screen.getByText(/Note: The run name is currently for local reference/i)).toBeInTheDocument();
  });

  test('allows typing into the run name input', () => {
    render(<CreateRunForm />);
    const inputElement = screen.getByLabelText(/Run Name \(Optional\)/i) as HTMLInputElement;
    
    fireEvent.change(inputElement, { target: { value: 'My Test Run' } });
    expect(inputElement.value).toBe('My Test Run');
  });

  describe('Button Click and API Interaction', () => {
    test('calls API, shows loading state, and success notification', async () => {
      const mockResponseData = {
        id: 123,
        name: 'Copied Run',
        created_at: new Date().toISOString(),
        copied_from: 122,
        settings_snapshot: { setting: 'value' },
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData });

      render(<CreateRunForm />);
      const button = screen.getByRole('button', { name: /Create Run From Last/i });
      
      fireEvent.click(button);

      // Check for loading state (button might be disabled or show loading text)
      // Mantine Button has a 'data-loading' attribute or a child loader
      expect(button).toBeDisabled(); // Mantine Button becomes disabled when loading prop is true

      // Wait for the success notification
      await waitFor(() => {
        expect(screen.getByText(/New run created successfully!/i)).toBeInTheDocument();
        expect(screen.getByText(/ID: 123/i)).toBeInTheDocument();
      });
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(`${baseUrl}/runs/new-from-last`, {});
      expect(button).not.toBeDisabled(); // Button should be re-enabled
    });

    test('shows error notification on API failure', async () => {
      const errorMessage = 'Network Error';
      // Mock a more specific Axios error for detail extraction
      const axiosError = {
        isAxiosError: true,
        response: { data: { detail: errorMessage } },
        message: 'Request failed',
      };
      mockedAxios.post.mockRejectedValueOnce(axiosError);

      render(<CreateRunForm />);
      const button = screen.getByRole('button', { name: /Create Run From Last/i });
      
      fireEvent.click(button);
      
      expect(button).toBeDisabled(); // Check loading state

      // Wait for the error notification
      await waitFor(() => {
        expect(screen.getByText(/Failed to create run/i)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(errorMessage, "i"))).toBeInTheDocument();
      });
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(`${baseUrl}/runs/new-from-last`, {});
      expect(button).not.toBeDisabled(); // Button should be re-enabled
    });
  });
});
