import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import type { Invoice } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface InvoiceModalProps {
  bookingId: string;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  bookingId,
  onClose,
}) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<Invoice>(`/api/invoices/booking/${bookingId}`)
      .then((res) => setInvoice(res.data))
      .catch((err) => {
        console.error('Failed to load invoice:', err);
        setError(
          err.response?.data?.message ||
            'Invoice not found. Invoice is generated once payment is completed successfully.'
        );
      })
      .finally(() => setIsLoading(false));
  }, [bookingId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">🧾 Service Invoice</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Generating invoice details..." />
        ) : error ? (
          <div className="banner banner-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        ) : invoice ? (
          <div>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Official Receipt
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {invoice.invoiceNumber}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Issued on {new Date(invoice.issuedAt).toLocaleString()}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Rendered</span>
                <span style={{ fontWeight: 600 }}>{invoice.serviceTitle || 'Home Service'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Booking Reference</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{invoice.bookingId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Platform Fee (10%)</span>
                <span>₹{invoice.platformCommission?.toFixed(2) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Provider Payout (90%)</span>
                <span>₹{invoice.providerPayout?.toFixed(2) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', fontSize: '1.15rem' }}>
                <span style={{ fontWeight: 700 }}>Total Paid Amount</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{invoice.amount?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span className="badge badge-success" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                ✓ PAID IN FULL
              </span>
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
