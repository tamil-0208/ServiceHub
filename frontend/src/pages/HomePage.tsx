import React, { useEffect, useState } from 'react';
import { apiClient, API_BASE_URL } from '../api/client';
import type { Category } from '../types';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Call public backend endpoint GET /api/categories to verify connectivity & CORS
    apiClient
      .get<Category[]>('/api/categories')
      .then((res) => {
        setCategories(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Could not connect to backend. Verify Spring Boot is running on port 8080.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Find Trusted Local Service Providers
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Hyperlocal on-demand services: Electricians, Plumbers, AC Technicians, Cleaners, and more.
        </p>
      </div>

      {/* Backend Integration Health Banner */}
      {loading ? (
        <div className="banner banner-info">
          <span>🔄</span>
          <span>Connecting to backend at <strong>{API_BASE_URL}</strong>...</span>
        </div>
      ) : error ? (
        <div className="banner banner-error">
          <span>⚠️</span>
          <div>
            <strong>Backend Connection Notice:</strong> {error}
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Target URL: <code>{API_BASE_URL}/api/categories</code>
            </div>
          </div>
        </div>
      ) : (
        <div className="banner banner-success">
          <span>✅</span>
          <span>
            <strong>Connected to Spring Boot backend!</strong> Successfully retrieved{' '}
            <strong>{categories.length}</strong> categories via <code>GET /api/categories</code>.
          </span>
        </div>
      )}

      {/* Service Categories Section */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Browse Categories</h2>
          <Link to="/providers" className="btn btn-primary btn-sm">
            View All Providers →
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid">
            {categories.map((category) => (
              <div key={category.id} className="card">
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛠️</div>
                <h3 className="card-title">{category.name}</h3>
                <p className="card-subtitle">{category.description}</p>
                <span className="badge badge-primary">Active Category</span>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="card" style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No categories found. Use the Admin panel or category API to add categories.
            </div>
          )
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
          Explore Platform Modules
        </h2>
        <div className="grid">
          <Link to="/providers" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 className="card-title">🔍 Browse Providers</h3>
            <p className="card-subtitle">Find local verified technicians and check schedules.</p>
          </Link>
          <Link to="/bookings" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 className="card-title">📅 Manage Bookings</h3>
            <p className="card-subtitle">Track service requests, acceptances, and completions.</p>
          </Link>
          <Link to="/dashboard" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 className="card-title">📊 User Dashboard</h3>
            <p className="card-subtitle">Manage customer addresses, provider services, or earnings.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
