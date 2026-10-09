import React from 'react';
import { Link } from 'react-router-dom';

export const ProvidersPage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Service Providers</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Discover and connect with top-rated local service professionals.
          </p>
        </div>
      </div>

      <div className="banner banner-info">
        <span>ℹ️</span>
        <span>Provider directory, search, and category filtering will be connected in the Providers stage.</span>
      </div>

      <div className="grid">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="card-title">Quick Fix Electricals</h3>
            <span className="badge badge-success">Verified</span>
          </div>
          <p className="card-subtitle">City: Downtown | Rating: ★ 4.9 (12 reviews)</p>
          <Link to="/providers/sample-id-1" className="btn btn-outline btn-sm">
            View Profile & Services →
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="card-title">Pro Plumbing Care</h3>
            <span className="badge badge-success">Verified</span>
          </div>
          <p className="card-subtitle">City: Westside | Rating: ★ 4.8 (8 reviews)</p>
          <Link to="/providers/sample-id-2" className="btn btn-outline btn-sm">
            View Profile & Services →
          </Link>
        </div>
      </div>
    </div>
  );
};
