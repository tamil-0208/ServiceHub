import React from 'react';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        User Dashboard
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Manage your profile, active bookings, notifications, and invoices.
      </p>

      <div className="card">
        <h2 className="card-title">Session Information</h2>
        <p className="card-subtitle">
          {user ? `Logged in as ${user.name} (${user.email})` : 'Viewing in guest mode (placeholder).'}
        </p>
        <div className="banner banner-info" style={{ marginTop: '1rem' }}>
          <span>ℹ️</span>
          <span>Role-aware customer/provider dashboard views will be built in the dashboard module stage.</span>
        </div>
      </div>
    </div>
  );
};
