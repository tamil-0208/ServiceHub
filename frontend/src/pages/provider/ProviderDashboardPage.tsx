import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getMyProviderProfile,
  getProviderServices,
  getProviderBookings,
  getEarnings,
} from '../../api/providers';
import type { Provider, ServiceItem, Booking, EarningsResponse } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ProviderDashboardPage: React.FC = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<EarningsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const provRes = await getMyProviderProfile();
        const p = provRes.data;
        setProvider(p);

        const [svcRes, bkgRes, earnRes] = await Promise.all([
          getProviderServices(p.id),
          getProviderBookings(),
          getEarnings(),
        ]);
        setServices(svcRes.data);
        setBookings(bkgRes.data);
        setEarnings(earnRes.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNoProfile(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (noProfile) {
    return (
      <div className="page-container" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
          <h2 style={{ marginBottom: '0.5rem' }}>You don't have a provider profile yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Create a provider profile to start offering your services.
          </p>
          <Link to="/provider/become" className="btn btn-primary">
            Become a Provider
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const activeCount = bookings.filter(b => b.status === 'ACCEPTED').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Provider Dashboard</h1>
          <p className="page-subtitle">{provider?.businessName}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {provider?.verified ? (
            <span className="badge badge-success">✓ Verified</span>
          ) : (
            <span className="badge badge-warning">Pending Verification</span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{services.length}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Services</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{pendingCount}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending Bookings</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{activeCount}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Bookings</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
            ₹{earnings ? earnings.totalEarnings.toFixed(2) : '0.00'}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Total Earnings ({earnings?.completedPaymentsCount ?? 0} payments)
          </div>
        </div>
      </div>

      {/* Quick nav cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Link to="/provider/bookings" className="card" style={{ padding: '1.5rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem' }}>📋</span>
          <strong>Manage Bookings</strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Accept, reject, or complete bookings</span>
        </Link>
        <Link to="/provider/services" className="card" style={{ padding: '1.5rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem' }}>🛠️</span>
          <strong>Manage Services</strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Add, edit, or deactivate your services</span>
        </Link>
        <Link to="/provider/schedule" className="card" style={{ padding: '1.5rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem' }}>📅</span>
          <strong>Manage Schedule</strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Set your weekly availability</span>
        </Link>
      </div>

      {/* Profile info */}
      {provider && (
        <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Profile Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {provider.description && (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Description</div>
                <div>{provider.description}</div>
              </div>
            )}
            {provider.phone && (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Phone</div>
                <div>{provider.phone}</div>
              </div>
            )}
            {provider.experience && (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Experience</div>
                <div>{provider.experience}</div>
              </div>
            )}
            {provider.address && (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Service Area</div>
                <div>{provider.address}</div>
              </div>
            )}
          </div>
          {provider.rejectionReason && (
            <div className="banner banner-error" style={{ marginTop: '1rem' }}>
              <strong>Rejection reason:</strong> {provider.rejectionReason}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
