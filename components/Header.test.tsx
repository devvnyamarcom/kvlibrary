
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';
import { Page, User } from '../types';
import React from 'react';

describe('Header Component', () => {
  const mockAdmin: User = {
    id: 'U-001',
    name: 'Budi Santoso',
    email: 'budi@telkomsel.co.id',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 hours ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  };

  const mockGuest: User = {
    id: 'U-005',
    name: 'Guest User',
    email: 'guest@telkomsel.co.id',
    role: 'Guest',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
  };

  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders correctly with the application logo', () => {
    render(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    expect(screen.getByText(/KV Library/i)).toBeTruthy();
  });

  it('displays the user name from the profile', () => {
    render(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    expect(screen.getByText('Budi Santoso')).toBeTruthy();
  });

  it('shows "Guest Mode" badge only when the user is a guest', () => {
    const { rerender } = render(
      <Header user={mockGuest} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    expect(screen.getByText('Guest Mode')).toBeTruthy();

    rerender(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    expect(screen.queryByText('Guest Mode')).toBeNull();
  });

  it('renders "Admin Panel" navigation item only for Admin users', () => {
    const { rerender } = render(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    expect(screen.getByText('Admin Panel')).toBeTruthy();

    rerender(
      <Header user={mockGuest} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    expect(screen.queryByText('Admin Panel')).toBeNull();
  });

  it('navigates to Dashboard when the Home button is clicked', () => {
    render(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith(Page.DASHBOARD);
  });

  it('navigates to Admin Panel when the Admin button is clicked', () => {
    render(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    fireEvent.click(screen.getByText('Admin Panel'));
    expect(mockNavigate).toHaveBeenCalledWith(Page.ADMIN);
  });

  it('navigates to Login page when the Logout button is clicked', () => {
    render(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    const logoutBtn = screen.getByText(/Logout/i);
    fireEvent.click(logoutBtn);
    expect(mockNavigate).toHaveBeenCalledWith(Page.LOGIN);
  });

  it('navigates to Profile when clicking the user avatar or name area', () => {
    render(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    const userNameElement = screen.getByText('Budi Santoso');
    fireEvent.click(userNameElement);
    expect(mockNavigate).toHaveBeenCalledWith(Page.PROFILE);
  });

  it('highlights the active page in the navigation menu', () => {
    const { rerender } = render(
      <Header user={mockAdmin} currentPage={Page.DASHBOARD} onNavigate={mockNavigate} />
    );
    const homeBtn = screen.getByText('Home');
    // Check for the active background color class defined in Header.tsx
    expect(homeBtn.className).toContain('bg-[#482325]');
    expect(homeBtn.className).toContain('text-white');

    rerender(
      <Header user={mockAdmin} currentPage={Page.ADMIN} onNavigate={mockNavigate} />
    );
    const adminBtn = screen.getByText('Admin Panel');
    expect(adminBtn.className).toContain('bg-[#482325]');
  });
});
