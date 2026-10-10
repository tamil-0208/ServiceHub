import React, { useEffect, useState, useCallback } from 'react';
import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
} from '../../api/providers';
import type { Booking, BookingStatus } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

const TABS: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'];

const STATUS_BADGE: Record<BookingStatus, string> = {
  PENDING: 'badge-warning',
  ACCEPTED: 'badge-success',
  REJECTED: 'badge-secondary',
  COMPLETED: 'badge-primary',
  CANCELLED: 'badge-secondary',
};

export const ProviderBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<BookingStatus | 'ALL'>('ALL');
  const [acting, setActing] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      const res = await getProviderBookings();
      setBookings(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const act = async (id: string, fn: () => Promise<any>) => {
    setActing(id);
    try {
      await fn();
      await loadBookings();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Action failed.');
    } finally {
      setActing(null);
    }
  };

  const filtered = tab === 'ALL' ? bookings : bookings.filter(b => b.status === tab);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadBookings} />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Incoming Bookings</h1>
          <p className="page-subtitle">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadBookings}>↻ Refresh</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t}
            className={`filter-pill ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
            <span style={{ marginLeft: '0.35rem', opacity: 0.7 }}>
              ({t === 'ALL' ? bookings.length : bookings.filter(b => b.status === t).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No bookings in this status.
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td>
                      <code style={{ fontSize: '0.75rem' }}>{b.id.slice(-8)}</code>
                    </td>
                    <td>{b.bookingDate}</td>
                    <td>{b.bookingTime?.substring(0, 5)}</td>
                    <td>₹{b.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[b.status] ?? 'badge-secondary'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {b.status === 'PENDING' && (
                          <>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'var(--success)', color: '#fff' }}
                              disabled={acting === b.id}
                              onClick={() => act(b.id, () => acceptBooking(b.id))}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'var(--error)', color: '#fff' }}
                              disabled={acting === b.id}
                              onClick={() => act(b.id, () => rejectBooking(b.id))}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {b.status === 'ACCEPTED' && (
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={acting === b.id}
                            onClick={() => act(b.id, () => completeBooking(b.id))}
                          >
                            Mark Complete
                          </button>
                        )}
                        {['COMPLETED', 'REJECTED', 'CANCELLED'].includes(b.status) && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
