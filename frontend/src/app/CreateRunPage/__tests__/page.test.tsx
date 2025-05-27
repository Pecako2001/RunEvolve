import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CreateRunPage from '../page'; // Path to the page component

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the CreateRunForm component to simplify page testing
jest.mock('@/components/CreateRunForm', () => {
  return function DummyCreateRunForm() {
    return <div data-testid="create-run-form-mock">Create Run Form Mock</div>;
  };
});

describe('CreateRunPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear(); // Though post is in the child component
  });

  test('renders basic elements like the title', () => {
    // Mock a successful response for initial render to avoid error states masking render issues
    mockedAxios.get.mockResolvedValueOnce({ data: { id: 1, name: 'Initial Run', created_at: new Date().toISOString(), settings_snapshot: {} } });
    render(<CreateRunPage />);
    expect(screen.getByRole('heading', { name: /Create New Run/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Preview Previous Run/i, level: 2 })).toBeInTheDocument();
  });

  describe('Display Previous Run Data', () => {
    test('shows loading indicator initially', () => {
      // Mock a promise that never resolves to keep it in loading state
      mockedAxios.get.mockImplementation(() => new Promise(() => {}));
      render(<CreateRunPage />);
      expect(screen.getByText(/Loading previous run details.../i)).toBeInTheDocument();
    });

    test('displays run data on successful API call', async () => {
      const mockRunData = {
        id: 101,
        name: 'Test Last Run',
        created_at: new Date().toISOString(),
        settings_snapshot: { mode: 'test', value: 42 },
        copied_from: null,
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockRunData });

      render(<CreateRunPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Previous Run Details/i)).toBeInTheDocument();
      });
      expect(screen.getByText(`ID: ${mockRunData.id}`)).toBeInTheDocument();
      expect(screen.getByText(`Name: ${mockRunData.name}`)).toBeInTheDocument();
      // Check for settings snapshot (might need to adjust query based on how it's rendered, e.g., pre tag)
      expect(screen.getByText(/"mode": "test"/i)).toBeInTheDocument();
      expect(screen.getByText(/"value": 42/i)).toBeInTheDocument();
    });

    test('displays error message on API failure', async () => {
      const errorMessage = 'Failed to fetch last run';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      render(<CreateRunPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Error fetching last run/i)).toBeInTheDocument();
        // Check for the specific error message if your component renders it
        expect(screen.getByText(new RegExp(errorMessage, "i"))).toBeInTheDocument();
      });
    });

    test('displays "no data" message on 404 API response', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404, data: { detail: "Not found" } },
        message: 'Request failed with status code 404',
      };
      mockedAxios.get.mockRejectedValueOnce(axiosError);

      render(<CreateRunPage />);
      
      await waitFor(() => {
        // The component should interpret 404 as "No previous run data available to preview."
        expect(screen.getByText(/No previous run data available to preview./i)).toBeInTheDocument();
      });
    });
  });

  test('renders the CreateRunForm component (mocked)', async () => {
    // Mock a successful response for initial render
    mockedAxios.get.mockResolvedValueOnce({ data: { id: 1, name: 'Initial Run', created_at: new Date().toISOString(), settings_snapshot: {} } });
    render(<CreateRunPage />);
    
    // Wait for any loading states to resolve
    await waitFor(() => {
      expect(screen.getByTestId('create-run-form-mock')).toBeInTheDocument();
    });
    expect(screen.getByText('Create Run Form Mock')).toBeInTheDocument();
  });
});
