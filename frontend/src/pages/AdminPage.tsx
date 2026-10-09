import React from 'react';

export const AdminPage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Oversight Portal</h1>
        <span className="badge badge-danger">Admin Only</span>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Manage platform users, provider verification, categories, bookings, payments, and system analytics.
      </p>

      <div className="card">
        <div className="banner banner-info">
          <span>ℹ️</span>
          <span>Admin verification workflows, category management, review moderation, and analytics summary metrics will be wired here.</span>
        </div>
      </div>
    </div>
  );
};
