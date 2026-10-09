import React from 'react';

export const BookingsPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Service Bookings
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Track your current appointments, history, status changes, and invoices.
      </p>

      <div className="card">
        <div className="banner banner-info">
          <span>ℹ️</span>
          <span>Booking list, status transitions (Accept/Reject/Complete/Cancel), payments, and reviews will be built in the bookings stage.</span>
        </div>
      </div>
    </div>
  );
};
