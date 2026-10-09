import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, currentUser, token } = useAuth();

  const activeUser = currentUser || user;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {activeUser?.name}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Role: <span className="badge badge-primary">{activeUser?.role}</span> | Email: {activeUser?.email}
          </p>
        </div>
      </div>

      <div className="banner banner-success">
        <span>🔒</span>
        <span>
          <strong>Authenticated Session Active:</strong> You are viewing a protected route (<code>/dashboard</code>).
          Token rehydration from <code>localStorage</code> is working.
        </span>
      </div>

      <div className="grid">
        <div className="card">
          <h2 className="card-title">👤 User Profile</h2>
          <p className="card-subtitle">Account ID: <code>{activeUser?.id}</code></p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Registered Role: <strong>{activeUser?.role}</strong>
          </p>
          <span className="badge badge-success">Active Account</span>
        </div>

        <div className="card">
          <h2 className="card-title">📅 Quick Actions</h2>
          <p className="card-subtitle">Manage your hyperlocal activities</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/providers" className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
              🔍 Find Service Providers
            </Link>
            <Link to="/bookings" className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
              📋 View My Bookings
            </Link>
            {activeUser?.role === 'ADMIN' && (
              <Link to="/admin" className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
                🛡️ Admin Oversight Portal
              </Link>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">🔑 JWT Token State</h2>
          <p className="card-subtitle">Client-side auth inspection</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
            {token ? `Bearer ${token.substring(0, 24)}...` : 'No token'}
          </p>
        </div>
      </div>
    </div>
  );
};
