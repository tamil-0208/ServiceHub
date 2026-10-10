import React, { useEffect, useState, useCallback } from 'react';
import { adminGetReviews, adminDeleteReview } from '../../api/admin';
import type { Review, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Pagination } from '../../components/common/Pagination';

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.25rem', fontSize: '0.8rem' }}>
      {rating}/5
    </span>
  </span>
);

export const AdminReviewsPage: React.FC = () => {
  const [data, setData] = useState<PageResponse<Review> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetReviews(p, 10);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently delete this review? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await adminDeleteReview(id);
      // Reload same page (or go back one if it was the last item)
      const newPage = data && data.content.length === 1 && page > 0 ? page - 1 : page;
      setPage(newPage);
      await load(newPage);
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to delete review.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Reviews Moderation</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
          {data ? `${data.totalElements} review${data.totalElements !== 1 ? 's' : ''}` : ''}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => load(page)} />
      ) : data && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Customer ID</th>
                  <th>Provider ID</th>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                      No reviews found.
                    </td>
                  </tr>
                ) : data.content.map(r => (
                  <tr key={r.id}>
                    <td><StarDisplay rating={r.rating} /></td>
                    <td style={{ maxWidth: 250 }}>
                      <span
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: '0.875rem',
                        }}
                      >
                        {r.comment ?? <em style={{ color: 'var(--text-secondary)' }}>No comment</em>}
                      </span>
                    </td>
                    <td><code style={{ fontSize: '0.75rem' }}>{r.customerId?.slice(-8)}</code></td>
                    <td><code style={{ fontSize: '0.75rem' }}>{r.providerId?.slice(-8)}</code></td>
                    <td><code style={{ fontSize: '0.75rem' }}>{r.bookingId?.slice(-8)}</code></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#ef4444', color: '#fff' }}
                        disabled={deletingId === r.id}
                        onClick={() => handleDelete(r.id)}
                      >
                        {deletingId === r.id ? '…' : 'Delete'}
                      </button>
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
