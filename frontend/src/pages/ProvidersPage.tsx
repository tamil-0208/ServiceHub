import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Provider } from '../types';
import { ProviderCard } from '../components/providers/ProviderCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const ProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = () => {
    setIsLoading(true);
    apiClient
      .get<Provider[]>('/api/providers')
      .then((res) => {
        setProviders(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch providers:', err);
        setError('Could not load service providers.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerified = !verifiedOnly || p.verified;

    return matchesSearch && matchesVerified;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Local Service Providers</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Find trusted, verified home service experts and technicians in your area.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '240px' }}
            placeholder="🔍 Search name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            Verified Only
          </label>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchProviders} />}

      {isLoading ? (
        <LoadingSpinner message="Loading local service providers..." />
      ) : filteredProviders.length > 0 ? (
        <div className="grid">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            No service providers found matching your criteria.
          </p>
          {(searchQuery || verifiedOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setVerifiedOnly(false);
              }}
              className="btn btn-outline btn-sm"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
