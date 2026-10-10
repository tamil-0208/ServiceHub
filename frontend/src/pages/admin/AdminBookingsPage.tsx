import React, { useEffect, useState, useCallback } from 'react';
import { adminGetBookings } from '../../api/admin';
import type { Booking, BookingStatus, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Pagination } from '../../components/common/Pagination';

const STATUS_OPTS: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'CANCELLED'];
const STATUS_BADGE: Record<string, string> = {
  PENDING: 'badge-warning',
  ACCEPTED: 'badge-success',
  COMPLETED: 'badge-primary',
  REJECTED: 'badge-secondary',
  CANCELLED: 'badge-secondary',
};

export const AdminBookingsPage: React.FC = () => {
  const [data, setData] = useState<PageResponse<Booking> | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (p: number, s: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetBookings(s, p, 10);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    load(0, statusFilter);
  }, [statusFilter, load]);

  useEffect(() => {
    load(page, statusFilter);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Bookings Monitor</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
          {data ? `${data.totalElements} total` : ''}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {STATUS_OPTS.map(s => (
          <button
            key={s}
            className={`filter-pill ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s as BookingStatus | 'ALL')}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => load(page, statusFilter)} />
      ) : data && (
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
                  <th>Customer</th>
                  <th>Provider</th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                      No bookings found.
                    </td>
                  </tr>
                ) : data.content.map(b => (
                  <tr key={b.id}>
                    <td><code style={{ fontSize: '0.75rem' }}>{b.id.slice(-8)}</code></td>
                    <td>{b.bookingDate}</td>
                    <td>{b.bookingTime?.substring(0, 5)}</td>
                    <td>₹{b.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[b.status] ?? 'badge-secondary'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td><code style={{ fontSize: '0.75rem' }}>{b.customerId?.slice(-8)}</code></td>
                    <td><code style={{ fontSize: '0.75rem' }}>{b.providerId?.slice(-8)}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data.number}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            size={data.size}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};
