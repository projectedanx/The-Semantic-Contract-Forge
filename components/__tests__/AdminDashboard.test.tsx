/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminDashboard from '../AdminDashboard';

describe('AdminDashboard', () => {
  it('renders the system metrics tab by default', () => {
    render(<AdminDashboard />);

    // Check header
    expect(screen.getAllByText('Instance Administration').length).toBeGreaterThan(0);

    // Check metric presence (from mock data)
    expect(screen.getAllByText('Active Instances').length).toBeGreaterThan(0);
    expect(screen.getAllByText('142').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Queries (24h)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('8405').length).toBeGreaterThan(0);
  });

  it('switches to the users access control tab', () => {
    render(<AdminDashboard />);

    const usersTabButton = screen.getAllByText('Access Control')[0];
    fireEvent.click(usersTabButton);

    // Check user table headers
    expect(screen.getAllByText('User ID').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Email').length).toBeGreaterThan(0);

    // Check mock user presence
    expect(screen.getAllByText('admin@forge.internal').length).toBeGreaterThan(0);
    expect(screen.getAllByText('researcher@inst.edu').length).toBeGreaterThan(0);
  });

  it('switches to the activity logs tab', () => {
    render(<AdminDashboard />);

    const logsTabButton = screen.getAllByText('Activity Logs')[0];
    fireEvent.click(logsTabButton);

    // Check logs trace
    expect(screen.getAllByText('System Activity Trace').length).toBeGreaterThan(0);

    // Check mock log presence
    expect(screen.getAllByText('User u-2 successfully validated strict JSON schema').length).toBeGreaterThan(0);
    expect(screen.getAllByText('VULCAN Guard blocked unauthorized mutation attempt from u-3').length).toBeGreaterThan(0);
  });
});
