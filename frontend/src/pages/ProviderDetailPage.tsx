import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Provider, ServiceItem, RatingSummary, Review, Schedule, PageResponse } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';
import { ReviewList } from '../components/reviews/ReviewList';
import { BookingModal } from '../components/bookings/BookingModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);

  const fetchProviderData = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      // Parallel requests for all provider sub-resources
      const [provRes, servRes, ratingRes, revRes, schedRes] = await Promise.all([
        apiClient.get<Provider>(`/api/providers/${id}`),
        apiClient.get<ServiceItem[]>(`/api/providers/${id}/services`),
        apiClient.get<RatingSummary>(`/api/providers/${id}/rating-summary`).catch(() => ({ data: { averageRating: 0, totalReviews: 0 } })),
        apiClient.get<PageResponse<Review>>(`/api/reviews/provider/${id}`).catch(() => ({ data: { content: [] } })),
        apiClient.get<Schedule[]>(`/api/providers/${id}/schedule`).catch(() => ({ data: [] })),
      ]);

      setProvider(provRes.data);
      setServices(servRes.data);
      setRatingSummary(ratingRes.data);
      setReviews(revRes.data?.content || []);
      setSchedules(schedRes.data);
    } catch (err: any) {
      console.error('Failed to load provider profile:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load provider profile. Please ensure the provider exists.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading provider profile and services..." />;
  }

  if (error || !provider) {
    return (
      <div>
        <Link to="/providers" style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Providers
        </Link>
        <ErrorMessage message={error || 'Provider not found'} onRetry={fetchProviderData} />
      </div>
    );
  }

  return (
    <div>
      <Link to="/providers" style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to All Providers
      </Link>

      {bookingSuccessMessage && (
        <div className="banner banner-success">
          <span>🎉</span>
          <span>{bookingSuccessMessage}</span>
          <Link to="/bookings" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
            View in My Bookings →
          </Link>
        </div>
      )}

      {/* Provider Profile Header */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{provider.businessName}</h1>
              {provider.verified ? (
                <span className="badge badge-success">✓ Verified Provider</span>
              ) : (
                <span className="badge badge-warning">Verification Pending</span>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              📍 {provider.city || 'City not specified'} {provider.address ? `• ${provider.address}` : ''}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="star-rating" style={{ fontSize: '1.2rem' }}>
                {'★'.repeat(Math.round(ratingSummary?.averageRating || 0)) +
                  '☆'.repeat(5 - Math.round(ratingSummary?.averageRating || 0))}
              </span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {ratingSummary && ratingSummary.totalReviews > 0
                  ? ratingSummary.averageRating.toFixed(1)
                  : 'New Provider'}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ({ratingSummary?.totalReviews || 0} verified customer reviews)
              </span>
            </div>
          </div>
        </div>

        {provider.bio && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
              About this Provider
            </h4>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{provider.bio}</p>
          </div>
        )}
      </div>

      {/* Weekly Schedule Banner */}
      {schedules.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            ⏰ Weekly Operating Schedule
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {schedules.map((slot) => (
              <div
                key={slot.id || slot.dayOfWeek}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: slot.available ? 'var(--primary-light)' : '#f1f5f9',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                }}
              >
                <strong>{slot.dayOfWeek}:</strong>{' '}
                {slot.available ? (
                  <span>
                    {slot.startTime} – {slot.endTime}
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Offered Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Services Offered by {provider.businessName}
        </h2>

        {services.length > 0 ? (
          <div className="grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={(srv) => setSelectedService(srv)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            This provider has not listed any active services yet.
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Customer Reviews & Ratings
        </h2>
        <ReviewList reviews={reviews} ratingSummary={ratingSummary} />
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          providerId={provider.id}
          onClose={() => setSelectedService(null)}
          onSuccess={(bookingId) => {
            setBookingSuccessMessage(
              `Booking successfully confirmed with ${provider.businessName}! Reference #${bookingId?.substring(0, 8) || ''}.`
            );
          }}
        />
      )}
    </div>
  );
};
