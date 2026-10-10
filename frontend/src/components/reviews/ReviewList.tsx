import React from 'react';
import type { Review, RatingSummary } from '../../types';

interface ReviewListProps {
  reviews: Review[];
  ratingSummary: RatingSummary | null;
  isLoading?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  ratingSummary,
  isLoading,
}) => {
  if (isLoading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading reviews...</div>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {ratingSummary && ratingSummary.totalReviews > 0
              ? ratingSummary.averageRating.toFixed(1)
              : '0.0'}
          </div>
          <div className="star-rating" style={{ fontSize: '1.25rem', margin: '0.25rem 0' }}>
            {'★'.repeat(Math.round(ratingSummary?.averageRating || 0)) +
              '☆'.repeat(5 - Math.round(ratingSummary?.averageRating || 0))}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Based on {ratingSummary?.totalReviews || 0} reviews
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem', flex: 1 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Customer Satisfaction
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Reviews submitted by verified customers who completed services with this provider.
          </p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id || Math.random().toString()}
              className="card"
              style={{ padding: '1rem 1.25rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="star-rating">
                    {'★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating)}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {rev.rating}/5
                  </span>
                </div>
                {rev.createdAt && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {rev.comment ? `"${rev.comment}"` : <em>No written comment provided.</em>}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          No reviews submitted yet for this provider.
        </div>
      )}
    </div>
  );
};
