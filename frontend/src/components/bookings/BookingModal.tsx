import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { ServiceItem, Address, AddressRequest, BookingRequest } from '../../types';

interface BookingModalProps {
  service: ServiceItem;
  providerId: string;
  onClose: () => void;
  onSuccess: (bookingId?: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  service,
  providerId: _providerId,
  onClose,
  onSuccess,
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Booking Form State
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState<string>('10:00');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Customer Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(true);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);

  // New Address Inline Form State
  const [newAddress, setNewAddress] = useState<AddressRequest>({
    label: 'Home',
    addressLine1: '',
    addressLine2: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    isDefault: true,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch customer saved addresses
  useEffect(() => {
    if (!isAuthenticated) return;

    apiClient
      .get<Address[]>('/api/addresses/me')
      .then((res) => {
        setAddresses(res.data);
        if (res.data.length > 0) {
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
        } else {
          setIsAddingNewAddress(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load addresses:', err);
      })
      .finally(() => {
        setIsLoadingAddresses(false);
      });
  }, [isAuthenticated]);

  // Handle saving a new address inline
  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.addressLine1.trim() || !newAddress.city.trim() || !newAddress.pincode.trim()) {
      setError('Please fill in Address Line 1, City, and Pincode.');
      return;
    }

    try {
      const res = await apiClient.post<Address>('/api/addresses', newAddress);
      const created = res.data;
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setIsAddingNewAddress(false);
      setError(null);
    } catch (err: any) {
      console.error('Failed to save address:', err);
      setError(err.response?.data?.message || 'Failed to save address.');
    }
  };

  // Submit Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    if (!selectedAddressId) {
      setError('Please select or add a service delivery address.');
      return;
    }

    if (!bookingDate || !bookingTime) {
      setError('Please choose a valid booking date and time.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Backend expects bookingTime formatted as HH:mm:ss or HH:mm
      const formattedTime = bookingTime.length === 5 ? `${bookingTime}:00` : bookingTime;

      const payload: BookingRequest = {
        serviceId: service.id,
        addressId: selectedAddressId,
        bookingDate,
        bookingTime: formattedTime,
      };

      const res = await apiClient.post('/api/bookings', payload);
      onSuccess(res.data?.id);
      onClose();
    } catch (err: any) {
      console.error('Booking submission failed:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to book appointment. The provider may not be available on this slot.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📅 Book Appointment</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Service Summary Banner */}
        <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {service.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ⏱️ Duration: {service.durationMinutes} mins
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{service.price.toLocaleString()}
            </span>
          </div>
        </div>

        {error && (
          <div className="banner banner-error" style={{ marginBottom: '1rem' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!isAuthenticated ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              You need to sign in as a Customer to confirm this service booking.
            </p>
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: window.location.pathname } } })}
              className="btn btn-primary"
            >
              Sign In to Continue →
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit}>
            {/* Date & Time Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-date">
                  Select Date *
                </label>
                <input
                  id="booking-date"
                  type="date"
                  className="form-input"
                  min={todayStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="booking-time">
                  Select Time *
                </label>
                <input
                  id="booking-time"
                  type="time"
                  className="form-input"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Address Selection Section */}
            <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Service Address *
                </label>
                {!isAddingNewAddress && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {isLoadingAddresses ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading saved addresses...</div>
              ) : !isAddingNewAddress ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <label
                        key={addr.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${selectedAddressId === addr.id ? 'var(--primary)' : 'var(--border)'}`,
                          backgroundColor: selectedAddressId === addr.id ? 'var(--primary-light)' : 'var(--surface)',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          style={{ marginTop: '0.2rem' }}
                        />
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{addr.label}</span>{' '}
                          {addr.isDefault && <span className="badge badge-primary">Default</span>}
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                            {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No saved addresses. Please add your service location below.
                    </div>
                  )}
                </div>
              ) : (
                /* Inline Add Address Form */
                <div style={{ padding: '1rem', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', backgroundColor: '#fcfdff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Add Delivery Address</h4>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Label (Home/Office)"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Street / Flat / House No *"
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="State *"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveNewAddress}
                    className="btn btn-outline btn-sm"
                  >
                    Save & Use Address
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || user?.role !== 'CUSTOMER'}
              >
                {isSubmitting ? 'Booking Appointment...' : 'Confirm & Request Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
