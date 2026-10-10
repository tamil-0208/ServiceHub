import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Category, ServiceItem } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';
import { BookingModal } from '../components/bookings/BookingModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);

  // Fetch Categories
  const fetchCategories = () => {
    setIsLoadingCategories(true);
    apiClient
      .get<Category[]>('/api/categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setError('Could not load categories. Please check backend connection.');
      })
      .finally(() => setIsLoadingCategories(false));
  };

  // Fetch Services
  const fetchServices = (catId?: string) => {
    setIsLoadingServices(true);
    const url = catId && catId !== 'ALL' ? `/api/services?categoryId=${catId}` : '/api/services';
    apiClient
      .get<ServiceItem[]>(url)
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch services:', err);
      })
      .finally(() => setIsLoadingServices(false));
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategoryId(catId);
    fetchServices(catId);
  };

  // Client-side keyword search filter
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', margin: '1rem auto 2.5rem', maxWidth: '700px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
          Hyperlocal Home Services, Delivered at Your Doorstep
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Book verified electricians, plumbers, carpenters, cleaners, and technicians near you in seconds.
        </p>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search services (e.g. Painting, AC Repair, Electrical)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-outline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {bookingSuccessMessage && (
        <div className="banner banner-success">
          <span>🎉</span>
          <span>{bookingSuccessMessage}</span>
          <Link to="/bookings" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
            View Bookings →
          </Link>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={fetchCategories} />}

      {/* Category Filter Pills */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Service Categories</h2>
          <Link to="/providers" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Explore Providers →
          </Link>
        </div>

        {isLoadingCategories ? (
          <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Loading categories...</div>
        ) : (
          <div className="filter-pills">
            <button
              className={`pill-btn ${selectedCategoryId === 'ALL' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('ALL')}
            >
              🌟 All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`pill-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                🛠️ {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Services Grid */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
            {selectedCategoryId === 'ALL'
              ? 'Featured Services'
              : `${categories.find((c) => c.id === selectedCategoryId)?.name || 'Category'} Services`}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filteredServices.length} available service{filteredServices.length === 1 ? '' : 's'}
          </span>
        </div>

        {isLoadingServices ? (
          <LoadingSpinner message="Loading services..." />
        ) : filteredServices.length > 0 ? (
          <div className="grid">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={(srv) => setSelectedService(srv)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', marginTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No services found matching your selection.
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn btn-outline btn-sm">
                Clear Search Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          providerId={selectedService.providerId}
          onClose={() => setSelectedService(null)}
          onSuccess={(bookingId) => {
            setBookingSuccessMessage(
              `Booking successfully created! Reference #${bookingId?.substring(0, 8) || ''}. The provider will review your appointment.`
            );
          }}
        />
      )}
    </div>
  );
};
