import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Booking } from '../types';
import { BookingRow } from '../components/bookings/BookingRow';
import { ReviewModal } from '../components/reviews/ReviewModal';
import { InvoiceModal } from '../components/invoices/InvoiceModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Link } from 'react-router-dom';

type FilterTab = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Review Modal State
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);

  // Invoice Modal State
  const [invoiceBookingId, setInvoiceBookingId] = useState<string | null>(null);

  const fetchBookings = () => {
    setIsLoading(true);
    setError(null);
    apiClient
      .get<Booking[]>('/api/bookings/me')
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error('Failed to load bookings:', err);
        setError('Could not retrieve your bookings. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking appointment?')) {
      return;
    }

    setActionLoadingId(bookingId);
    setError(null);
    setSuccessMessage(null);

    try {
      await apiClient.put(`/api/bookings/${bookingId}/cancel`);
      setSuccessMessage('Booking cancelled successfully.');
      fetchBookings();
    } catch (err: any) {
      console.error('Failed to cancel booking:', err);
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Pay for Completed Booking
  const handlePayBooking = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    setError(null);
    setSuccessMessage(null);

    try {
      await apiClient.post(`/api/payments/initiate/${bookingId}`);
      setSuccessMessage('Payment processed successfully! Your official invoice is ready.');
      fetchBookings();
      // Automatically open the invoice receipt modal
      setInvoiceBookingId(bookingId);
    } catch (err: any) {
      console.error('Payment initiation failed:', err);
      setError(err.response?.data?.message || 'Payment initiation failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter bookings according to active tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return b.status === 'PENDING' || b.status === 'ACCEPTED';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'REJECTED';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Service Appointments</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track your service requests, manage appointments, pay invoices, and review providers.
          </p>
        </div>

        <Link to="/" className="btn btn-primary btn-sm">
          + Book New Service
        </Link>
      </div>

      {successMessage && (
        <div className="banner banner-success">
          <span>✅</span>
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            style={{ background: 'none', border: 'none', marginLeft: 'auto', cursor: 'pointer', fontWeight: 700 }}
          >
            ×
          </button>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={fetchBookings} />}

      {/* Filter Tabs */}
      <div className="filter-pills" style={{ marginBottom: '1.25rem' }}>
        <button
          className={`pill-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Appointments ({bookings.length})
        </button>
        <button
          className={`pill-btn ${activeTab === 'ACTIVE' ? 'active' : ''}`}
          onClick={() => setActiveTab('ACTIVE')}
        >
          Active / Pending ({bookings.filter((b) => b.status === 'PENDING' || b.status === 'ACCEPTED').length})
        </button>
        <button
          className={`pill-btn ${activeTab === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setActiveTab('COMPLETED')}
        >
          Completed ({bookings.filter((b) => b.status === 'COMPLETED').length})
        </button>
        <button
          className={`pill-btn ${activeTab === 'CANCELLED' ? 'active' : ''}`}
          onClick={() => setActiveTab('CANCELLED')}
        >
          Cancelled / Rejected ({bookings.filter((b) => b.status === 'CANCELLED' || b.status === 'REJECTED').length})
        </button>
      </div>

      {/* Bookings Table / List */}
      {isLoading ? (
        <LoadingSpinner message="Loading your appointments..." />
      ) : filteredBookings.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Service & Ref</th>
                <th>Scheduled Date & Time</th>
                <th>Total Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                  onPay={handlePayBooking}
                  onReview={(bId) => setReviewBookingId(bId)}
                  onViewInvoice={(bId) => setInvoiceBookingId(bId)}
                  isActionLoading={actionLoadingId === booking.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            No Bookings Found
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {activeTab === 'ALL'
              ? 'You have not booked any local home services yet.'
              : `No appointments found in the "${activeTab}" filter.`}
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Services & Book Now →
          </Link>
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <ReviewModal
          bookingId={reviewBookingId}
          onClose={() => setReviewBookingId(null)}
          onSuccess={() => {
            setSuccessMessage('Thank you! Your review has been published.');
            fetchBookings();
          }}
        />
      )}

      {/* Invoice Modal */}
      {invoiceBookingId && (
        <InvoiceModal
          bookingId={invoiceBookingId}
          onClose={() => setInvoiceBookingId(null)}
        />
      )}
    </div>
  );
};
