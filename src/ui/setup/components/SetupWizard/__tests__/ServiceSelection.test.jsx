import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ServiceSelection from '../steps/ServiceSelection';

describe('ServiceSelection', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all service categories', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Check for main service categories
    expect(screen.getByText('Core Services')).toBeInTheDocument();
    expect(screen.getByText('Media Services')).toBeInTheDocument();
    expect(screen.getByText('Download Services')).toBeInTheDocument();
    expect(screen.getByText('Book Services')).toBeInTheDocument();
    expect(screen.getByText('Monitoring Services')).toBeInTheDocument();
  });

  it('shows required services as checked and disabled', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Core services should be required
    const requiredServices = [
      'nginx proxy manager',
      'authelia',
      'redis',
      'fail2ban',
      'portainer'
    ];

    requiredServices.forEach(service => {
      const checkbox = screen.getByRole('checkbox', {
        name: new RegExp(service, 'i'),
      });
      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
    });
  });

  it('shows resource summary in compact layout', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    const summary = screen.getByText('Resource Summary').closest('div');
    
    // Check inline stats
    const stats = within(summary).getAllByText(/^(CPU Cores|Memory):/);
    expect(stats).toHaveLength(2);
    
    // Check info box
    expect(within(summary).getByText(/estimated minimum requirements/i))
      .toBeInTheDocument();
  });

  it('includes Portainer in core services with proper dependencies', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    const portainerSection = screen.getByText('Portainer').closest('div');
    
    // Check required status
    expect(within(portainerSection).getByText('Required')).toBeInTheDocument();
    
    // Check dependencies
    expect(within(portainerSection).getByText('Has Dependencies')).toBeInTheDocument();
    
    // Check security info
    expect(within(portainerSection).getByText('Security Info')).toBeInTheDocument();
  });

  it('handles service dependencies correctly', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Find Sonarr checkbox
    const sonarrCheckbox = screen.getByRole('checkbox', {
      name: /sonarr/i,
    });

    // Click Sonarr checkbox
    fireEvent.click(sonarrCheckbox);

    // Dependencies should be automatically selected
    const qbittorrentCheckbox = screen.getByRole('checkbox', {
      name: /qbittorrent/i,
    });
    const prowlarrCheckbox = screen.getByRole('checkbox', {
      name: /prowlarr/i,
    });

    expect(qbittorrentCheckbox).toBeChecked();
    expect(prowlarrCheckbox).toBeChecked();
  });

  it('prevents removing services with dependencies', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Select Sonarr which requires qBittorrent
    const sonarrCheckbox = screen.getByRole('checkbox', {
      name: /sonarr/i,
    });
    fireEvent.click(sonarrCheckbox);

    // Try to uncheck qBittorrent
    const qbittorrentCheckbox = screen.getByRole('checkbox', {
      name: /qbittorrent/i,
    });
    fireEvent.click(qbittorrentCheckbox);

    // qBittorrent should still be checked
    expect(qbittorrentCheckbox).toBeChecked();

    // Alert should be shown
    expect(screen.getByText(/cannot remove.*required by/i)).toBeInTheDocument();
  });

  it('calculates resource requirements correctly', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Select multiple services
    const sonarrCheckbox = screen.getByRole('checkbox', {
      name: /sonarr/i,
    });
    const radarrCheckbox = screen.getByRole('checkbox', {
      name: /radarr/i,
    });

    fireEvent.click(sonarrCheckbox);
    fireEvent.click(radarrCheckbox);

    // Check resource summary
    const resourceSummary = screen.getByText(/estimated resource usage/i)
      .parentElement;
    
    expect(within(resourceSummary).getByText(/cpu cores:/i)).toBeInTheDocument();
    expect(within(resourceSummary).getByText(/memory:/i)).toBeInTheDocument();
  });

  it('expands service category on click', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Click Media Services category
    const mediaServicesButton = screen.getByText('Media Services');
    fireEvent.click(mediaServicesButton);

    // Check if services are visible
    expect(screen.getByText('Plex Media Server')).toBeVisible();
    expect(screen.getByText('Sonarr')).toBeVisible();
    expect(screen.getByText('Radarr')).toBeVisible();
  });

  it('shows service descriptions in tooltips', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Expand Media Services
    const mediaServicesButton = screen.getByText('Media Services');
    fireEvent.click(mediaServicesButton);

    // Find and hover over info icon for Plex
    const plexInfoIcon = screen.getByTestId('plex-info-icon');
    fireEvent.mouseOver(plexInfoIcon);

    // Check if tooltip is shown
    expect(screen.getByText('Media streaming server')).toBeInTheDocument();
  });

  it('shows dependency chips for services', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Expand Media Services
    const mediaServicesButton = screen.getByText('Media Services');
    fireEvent.click(mediaServicesButton);

    // Check for dependency chips
    expect(screen.getByText('Has Dependencies')).toBeInTheDocument();
  });

  it('updates URL when services are selected', () => {
    render(<ServiceSelection onNext={mockOnNext} />);

    // Select a service
    const sonarrCheckbox = screen.getByRole('checkbox', {
      name: /sonarr/i,
    });
    fireEvent.click(sonarrCheckbox);

    // Check if URL params are updated
    expect(window.location.search).toContain('services=');
  });
});