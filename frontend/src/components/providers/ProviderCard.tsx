import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import type { Provider, RatingSummary } from '../../types';

interface ProviderCardProps {
  provider: Provider;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const [rating, setRating] = useState<RatingSummary | null>(null);

  useEffect(() => {
    // Fetch rating summary for this provider
    apiClient
      .get<RatingSummary>(`/api/providers/${provider.id}/rating-summary`)
      .then((res) => setRating(res.data))
      .catch(() => setRating({ averageRating: 0, totalReviews: 0 }));
  }, [provider.id]);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: 0 }}>
            {provider.businessName}
          </h3>
          {provider.verified ? (
            <span className="badge badge-success">✓ Verified</span>
          ) : (
            <span className="badge badge-warning">Unverified</span>
          )}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          📍 {provider.city || 'Local Area'} {provider.address ? `• ${provider.address}` : ''}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="star-rating">★</span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {rating && rating.totalReviews > 0
              ? rating.averageRating.toFixed(1)
              : 'New'}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            ({rating?.totalReviews || 0} reviews)
          </span>
        </div>

        <p className="card-subtitle" style={{ minHeight: '2.5rem' }}>
          {provider.bio || 'Experienced local professional offering quality services.'}
        </p>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <Link
          to={`/providers/${provider.id}`}
          className="btn btn-outline btn-block btn-sm"
        >
          View Profile & Services →
        </Link>
      </div>
    </div>
  );
};
