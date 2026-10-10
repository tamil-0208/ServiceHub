import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ADMIN_NAV = [
  { to: '/admin', label: '📊 Overview', end: true },
  { to: '/admin/users', label: '👥 Users', end: false },
  { to: '/admin/providers', label: '🏪 Providers', end: false },
  { to: '/admin/bookings', label: '📋 Bookings', end: false },
  { to: '/admin/payments', label: '💳 Payments', end: false },
  { to: '/admin/reviews', label: '⭐ Reviews', end: false },
  { to: '/admin/categories', label: '🏷️ Categories', end: false },
];

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout-container" style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: 220,
          flexShrink: 0,
          background: '#0f172a',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 0',
          position: 'sticky',
          top: 64,
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            padding: '0 1.25rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.4rem' }}>
            ADMIN PORTAL
          </div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Logged in as <strong style={{ color: '#e2e8f0' }}>{user?.name}</strong>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {ADMIN_NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.65rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: '#475569' }}>
          Hypermarketplace Admin
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main-content" style={{ flex: 1, padding: '2rem', overflowX: 'hidden', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
};
