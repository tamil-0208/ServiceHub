import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Link to="/providers" style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Providers
      </Link>

      <div className="card">
        <h1 className="card-title">Provider Profile</h1>
        <p className="card-subtitle">Provider ID: <code>{id}</code></p>
        <div className="banner banner-info" style={{ marginTop: '1rem' }}>
          <span>ℹ️</span>
          <span>Provider details, service catalog, availability schedule, and booking actions will be rendered here.</span>
        </div>
      </div>
    </div>
  );
};
