import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SystemRequirements } from '../steps/SystemRequirements';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('SystemRequirements', () => {
  const mockOnNext = jest.fn();
  const mockIsFirstStep = true;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <SystemRequirements
        onNext={mockOnNext}
        isFirstStep={mockIsFirstStep}
      />
    );
    expect(screen.getByText('Checking system requirements...')).toBeInTheDocument();
  });

  it('displays system requirements when loaded', async () => {
    // Mock successful system check
    axios.post.mockResolvedValueOnce({
      data: {
        cpu: {
          cores: 4,
          model: 'Intel Core i7'
        },
        memory: {
          total: 16,
          free: 8
        },
        docker: {
          installed: true,
          version: '24.0.7'
        },
        dockerCompose: {
          installed: true,
          version: '2.21.0'
        },
        network: {
          portsAvailable: true
        }
      }
    });

    render(
      <SystemRequirements
        onNext={mockOnNext}
        isFirstStep={mockIsFirstStep}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('CPU Cores:')).toBeInTheDocument();
      expect(screen.getByText('4 cores')).toBeInTheDocument();
    });

    expect(screen.getByText('Memory:')).toBeInTheDocument();
    expect(screen.getByText('16GB')).toBeInTheDocument();
  });

  it('displays error state when system check fails', async () => {
    // Mock failed system check
    axios.post.mockRejectedValueOnce(new Error('Failed to check system'));

    render(
      <SystemRequirements
        onNext={mockOnNext}
        isFirstStep={mockIsFirstStep}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to perform system requirements check')).toBeInTheDocument();
    });
  });

  it('displays warning for minimum requirements not met', async () => {
    // Mock system check with insufficient resources
    axios.post.mockResolvedValueOnce({
      data: {
        cpu: {
          cores: 2,
          model: 'Intel Core i3'
        },
        memory: {
          total: 4,
          free: 2
        },
        docker: {
          installed: true,
          version: '24.0.7'
        },
        dockerCompose: {
          installed: true,
          version: '2.21.0'
        },
        network: {
          portsAvailable: true
        }
      }
    });

    render(
      <SystemRequirements
        onNext={mockOnNext}
        isFirstStep={mockIsFirstStep}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Minimum 4 CPU cores required')).toBeInTheDocument();
      expect(screen.getByText('Recommended minimum is 8GB RAM')).toBeInTheDocument();
    });
  });

  it('enables next button when all requirements are met', async () => {
    // Mock successful system check
    axios.post.mockResolvedValueOnce({
      data: {
        cpu: {
          cores: 8,
          model: 'Intel Core i9'
        },
        memory: {
          total: 32,
          free: 16
        },
        docker: {
          installed: true,
          version: '24.0.7'
        },
        dockerCompose: {
          installed: true,
          version: '2.21.0'
        },
        network: {
          portsAvailable: true
        }
      }
    });

    render(
      <SystemRequirements
        onNext={mockOnNext}
        isFirstStep={mockIsFirstStep}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Your system meets the minimum requirements')).toBeInTheDocument();
    });
  });
});