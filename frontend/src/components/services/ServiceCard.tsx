import React from 'react';
import type { ServiceItem } from '../../types';

interface ServiceCardProps {
  service: ServiceItem;
  onBook?: (service: ServiceItem) => void;
  showBookButton?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBook,
  showBookButton = true,
}) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: 0 }}>
            {service.title}
          </h3>
          <span className="badge badge-primary">
            ⏱️ {service.durationMinutes} mins
          </span>
        </div>

        <p className="card-subtitle" style={{ minHeight: '2.8rem' }}>
          {service.description || 'Professional on-demand service.'}
        </p>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
            ₹{service.price.toLocaleString()}
          </span>
        </div>

        {showBookButton && onBook && (
          <button
            onClick={() => onBook(service)}
            className="btn btn-primary btn-sm"
          >
            Book Now ⚡
          </button>
        )}
      </div>
    </div>
  );
};
