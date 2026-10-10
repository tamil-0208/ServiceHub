import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import type { Booking, Payment, ServiceItem } from '../../types';

interface BookingRowProps {
  booking: Booking;
  onCancel: (id: string) => void;
  onPay: (bookingId: string) => void;
  onReview: (bookingId: string) => void;
  onViewInvoice: (bookingId: string) => void;
  isActionLoading?: boolean;
}

export const BookingRow: React.FC<BookingRowProps> = ({
  booking,
  onCancel,
  onPay,
  onReview,
  onViewInvoice,
  isActionLoading,
}) => {
  const [service, setService] = useState<ServiceItem | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);

  // Fetch service details for this booking
  useEffect(() => {
    if (booking.serviceId) {
      apiClient
        .get<ServiceItem>(`/api/services/${booking.serviceId}`)
        .then((res) => setService(res.data))
        .catch(() => {});
    }
  }, [booking.serviceId]);

  // If completed, check payment status
  useEffect(() => {
    if (booking.status === 'COMPLETED') {
      apiClient
        .get<Payment>(`/api/payments/booking/${booking.id}`)
        .then((res) => {
          setPayment(res.data);
        })
        .catch(() => {
          // No payment initiated yet
          setPayment(null);
        });
    }
  }, [booking.id, booking.status]);

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'PENDING':
        return <span className="badge badge-warning">⏳ Pending</span>;
      case 'ACCEPTED':
        return <span className="badge badge-primary">✓ Accepted</span>;
      case 'COMPLETED':
        return <span className="badge badge-success">★ Completed</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">✕ Rejected</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">✕ Cancelled</span>;
      default:
        return <span className="badge badge-primary">{booking.status}</span>;
    }
  };

  const isPaid = payment && payment.status === 'SUCCESS';

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 700 }}>
          {service?.title || `Service #${booking.serviceId.substring(0, 8)}`}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ID: <code>{booking.id.substring(0, 10)}...</code>
        </div>
      </td>

      <td>
        <div style={{ fontWeight: 500 }}>
          📅 {booking.bookingDate}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ⏰ {booking.bookingTime?.substring(0, 5)}
        </div>
      </td>

      <td>
        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
          ₹{(booking.totalAmount || service?.price || 0).toLocaleString()}
        </div>
        {booking.status === 'COMPLETED' && (
          <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
            {isPaid ? (
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Paid</span>
            ) : (
              <span style={{ color: 'var(--warning)', fontWeight: 600 }}>● Payment Due</span>
            )}
          </div>
        )}
      </td>

      <td>{getStatusBadge()}</td>

      <td style={{ textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {/* Cancel Booking Action */}
          {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={isActionLoading}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
            >
              Cancel
            </button>
          )}

          {/* Completed Booking Actions: Pay, Invoice, Review */}
          {booking.status === 'COMPLETED' && (
            <>
              {!isPaid ? (
                <button
                  onClick={() => onPay(booking.id)}
                  disabled={isActionLoading}
                  className="btn btn-primary btn-sm"
                >
                  💳 Pay Now
                </button>
              ) : (
                <button
                  onClick={() => onViewInvoice(booking.id)}
                  className="btn btn-outline btn-sm"
                >
                  🧾 View Invoice
                </button>
              )}

              <button
                onClick={() => onReview(booking.id)}
                className="btn btn-outline btn-sm"
              >
                ⭐ Review
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
