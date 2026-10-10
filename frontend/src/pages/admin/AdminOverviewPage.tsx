import React, { useEffect, useState } from 'react';
import { getAnalyticsSummary } from '../../api/admin';
import type { AdminAnalyticsSummary } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  ACCEPTED: '#10b981',
  COMPLETED: '#6366f1',
  REJECTED: '#6b7280',
  CANCELLED: '#ef4444',
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon: string;
}> = ({ label, value, sub, color = 'var(--primary)', icon }) => (
  <div
    className="card"
    style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: `${color}1a`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, color }}>{value}</div>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  </div>
);

export const AdminOverviewPage: React.FC = () => {
  const [summary, setSummary] = useState<AdminAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalyticsSummary()
      .then(r => setSummary(r.data))
      .catch(err => setError(err.response?.data?.message ?? 'Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!summary) return null;

  const bookingEntries = Object.entries(summary.bookingsByStatus ?? {});
  const totalBookings = bookingEntries.reduce((s, [, v]) => s + v, 0);

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Platform Overview</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          Live aggregate metrics across all modules.
        </p>
      </div>

      {/* Top stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard icon="👥" label="Total Users" value={summary.totalUsers} color="#6366f1" />
        <StatCard
          icon="🏪"
          label="Total Providers"
          value={summary.totalProviders}
          sub={`${summary.verifiedProviders} verified · ${summary.unverifiedProviders} pending`}
          color="#0ea5e9"
        />
        <StatCard
          icon="📋"
          label="Total Bookings"
          value={totalBookings}
          color="#f59e0b"
        />
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`₹${summary.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          color="#10b981"
        />
      </div>

      {/* Provider verification split */}
      <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700 }}>Provider Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#10b981' }}>✓ Verified</span>
                <strong>{summary.verifiedProviders}</strong>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    background: '#10b981',
                    width: summary.totalProviders > 0
                      ? `${(summary.verifiedProviders / summary.totalProviders) * 100}%`
                      : '0%',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#f59e0b' }}>⏳ Pending</span>
                <strong>{summary.unverifiedProviders}</strong>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    background: '#f59e0b',
                    width: summary.totalProviders > 0
                      ? `${(summary.unverifiedProviders / summary.totalProviders) * 100}%`
                      : '0%',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings by status */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700 }}>Bookings by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {bookingEntries.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No booking data.</p>
            ) : (
              bookingEntries.map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: BOOKING_STATUS_COLORS[status] ?? '#6b7280',
                        flexShrink: 0,
                      }}
                    />
                    <span>{status}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
