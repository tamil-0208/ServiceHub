import React, { useEffect, useState, useCallback } from 'react';
import { adminGetUsers } from '../../api/admin';
import type { UserResponse, PageResponse } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Pagination } from '../../components/common/Pagination';

const ROLE_BADGE: Record<string, string> = {
  ADMIN: 'badge-danger',
  PROVIDER: 'badge-primary',
  CUSTOMER: 'badge-success',
};

export const AdminUsersPage: React.FC = () => {
  const [data, setData] = useState<PageResponse<UserResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetUsers(p, 10);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Users</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
          {data ? `${data.totalElements} registered user${data.totalElements !== 1 ? 's' : ''}` : ''}
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                      No registered users found.
                    </td>
                  </tr>
                ) : (
                  data.content.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${ROLE_BADGE[u.role] ?? 'badge-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.75rem' }}>{u.id.slice(-8)}</code>
                      </td>
                    </tr>
                  ))
                )}
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
