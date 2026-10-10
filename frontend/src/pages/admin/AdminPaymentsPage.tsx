import React, { useEffect, useState, useCallback } from 'react';
import { adminGetPayments } from '../../api/admin';
import type { Payment, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Pagination } from '../../components/common/Pagination';

type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
const STATUS_OPTS: (PaymentStatus | 'ALL')[] = ['ALL', 'PENDING', 'SUCCESS', 'FAILED'];
const STATUS_BADGE: Record<string, string> = {
  PENDING: 'badge-warning',
  SUCCESS: 'badge-success',
  FAILED: 'badge-danger',
};

export const AdminPaymentsPage: React.FC = () => {
  const [data, setData] = useState<PageResponse<Payment> | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (p: number, s: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetPayments(s, p, 10);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load payments.');
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
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Payments Monitor</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
          {data ? `${data.totalElements} total` : ''}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {STATUS_OPTS.map(s => (
          <button
            key={s}
            className={`filter-pill ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s as PaymentStatus | 'ALL')}
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
                  <th>Txn ID</th>
                  <th>Booking</th>
                  <th>Amount</th>
                  <th>Commission</th>
                  <th>Payout</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                      No payments found.
                    </td>
                  </tr>
                ) : data.content.map(p => (
                  <tr key={p.id}>
                    <td><code style={{ fontSize: '0.75rem' }}>{p.transactionId?.slice(-8) ?? '—'}</code></td>
                    <td><code style={{ fontSize: '0.75rem' }}>{p.bookingId?.slice(-8)}</code></td>
                    <td>₹{p.amount?.toFixed(2)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>₹{p.platformCommission?.toFixed(2)}</td>
                    <td style={{ color: '#10b981' }}>₹{p.providerPayout?.toFixed(2)}</td>
                    <td>{p.paymentMethod ?? '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[p.status] ?? 'badge-secondary'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
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
