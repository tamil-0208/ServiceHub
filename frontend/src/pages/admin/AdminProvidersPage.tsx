import React, { useEffect, useState, useCallback } from 'react';
import { adminGetAllProviders, adminVerifyProvider, adminRejectProvider } from '../../api/admin';
import type { Provider } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const AdminProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'ALL' | 'PENDING' | 'VERIFIED'>('ALL');

  // Reject modal
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetAllProviders();
      setProviders(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load providers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleVerify = async (id: string) => {
    setActing(id);
    try {
      await adminVerifyProvider(id);
      await load();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to verify provider.');
    } finally {
      setActing(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectId) return;
    if (!rejectReason.trim()) { setRejectError('Reason is required.'); return; }
    setActing(rejectId);
    setRejectError('');
    try {
      await adminRejectProvider(rejectId, rejectReason.trim());
      setRejectId(null);
      setRejectReason('');
      await load();
    } catch (err: any) {
      setRejectError(err.response?.data?.message ?? 'Failed to reject provider.');
    } finally {
      setActing(null);
    }
  };

  const filtered =
    tab === 'ALL' ? providers :
    tab === 'PENDING' ? providers.filter(p => !p.verified) :
    providers.filter(p => p.verified);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Providers</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
          {providers.filter(p => !p.verified).length} pending verification
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['ALL', 'PENDING', 'VERIFIED'] as const).map(t => (
          <button
            key={t}
            className={`filter-pill ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t} ({
              t === 'ALL' ? providers.length :
              t === 'PENDING' ? providers.filter(p => !p.verified).length :
              providers.filter(p => p.verified).length
            })
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No providers in this filter.
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Phone</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.businessName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.phone ?? '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.experience ?? '—'}</td>
                    <td>
                      {p.verified ? (
                        <span className="badge badge-success">✓ Verified</span>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                      {p.rejectionReason && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.2rem' }}>
                          {p.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!p.verified && (
                          <button
                            className="btn btn-sm"
                            style={{ background: '#10b981', color: '#fff' }}
                            disabled={acting === p.id}
                            onClick={() => handleVerify(p.id)}
                          >
                            Verify
                          </button>
                        )}
                        <button
                          className="btn btn-sm"
                          style={{ background: '#ef4444', color: '#fff' }}
                          disabled={acting === p.id}
                          onClick={() => { setRejectId(p.id); setRejectReason(''); setRejectError(''); }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="modal-overlay" onClick={() => setRejectId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <h2 className="modal-title">Reject Provider</h2>
              <button className="modal-close" onClick={() => setRejectId(null)}>×</button>
            </div>
            <div className="modal-body">
              {rejectError && (
                <div className="banner banner-error" style={{ marginBottom: '1rem' }}>{rejectError}</div>
              )}
              <div className="form-group">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Explain why this provider is being rejected..."
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setRejectId(null)}>Cancel</button>
                <button
                  className="btn btn-sm"
                  style={{ background: '#ef4444', color: '#fff' }}
                  onClick={handleRejectSubmit}
                  disabled={!!acting}
                >
                  {acting ? 'Rejecting…' : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
