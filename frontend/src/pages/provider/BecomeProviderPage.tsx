import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProviderProfile } from '../../api/providers';
import type { ProviderRequest } from '../../types';

export const BecomeProviderPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProviderRequest>({
    businessName: '',
    description: '',
    phone: '',
    experience: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) {
      setError('Business name is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createProviderProfile(form);
      navigate('/provider');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to create provider profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Become a Provider</h1>
        <p className="page-subtitle">
          Set up your service provider profile to start offering services on Hypermarketplace.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && <div className="banner banner-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Business Name *</label>
            <input
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Tamil's Cleaning Services"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Tell customers about your business..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="+91 98765 43210"
              type="tel"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Experience</label>
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 5 years in home cleaning"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Service Area / Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Chennai, Tamil Nadu"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating Profile…' : 'Create Provider Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};
