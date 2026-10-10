import React, { useEffect, useState, useCallback } from 'react';
import {
  getMyProviderProfile,
  getProviderServices,
  createService,
  updateService,
  deleteService,
} from '../../api/providers';
import client from '../../api/client';
import type { ServiceItem, Category, ServiceRequest } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

const EMPTY_FORM: ServiceRequest = {
  title: '',
  description: '',
  price: 0,
  durationMinutes: 60,
  categoryId: '',
};

export const ManageServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceRequest>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadServices = useCallback(async (pid: string) => {
    const res = await getProviderServices(pid);
    setServices(res.data);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const [provRes, catRes] = await Promise.all([
          getMyProviderProfile(),
          client.get<Category[]>('/api/categories'),
        ]);
        const pid = provRes.data.id;
        setProviderId(pid);
        setCategories(catRes.data);
        await loadServices(pid);
      } catch (err: any) {
        setError(err.response?.data?.message ?? 'Failed to load services.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [loadServices]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (svc: ServiceItem) => {
    setForm({
      title: svc.title,
      description: svc.description ?? '',
      price: svc.price,
      durationMinutes: svc.durationMinutes,
      categoryId: svc.categoryId,
    });
    setEditingId(svc.id);
    setFormError('');
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'durationMinutes' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (!form.price || form.price <= 0) { setFormError('Price must be greater than 0.'); return; }
    if (!form.categoryId) { setFormError('Please select a category.'); return; }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingId) {
        await updateService(editingId, form);
      } else {
        await createService(form);
      }
      setShowModal(false);
      if (providerId) await loadServices(providerId);
    } catch (err: any) {
      setFormError(err.response?.data?.message ?? 'Failed to save service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (svc: ServiceItem) => {
    if (!window.confirm(`Deactivate "${svc.title}"? Customers won't be able to book it.`)) return;
    try {
      await deleteService(svc.id);
      if (providerId) await loadServices(providerId);
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to deactivate service.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Services</h1>
          <p className="page-subtitle">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Service</button>
      </div>

      {services.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛠️</div>
          <p style={{ color: 'var(--text-secondary)' }}>No services yet. Add your first service to start accepting bookings.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={openCreate}>Add Service</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {services.map(svc => (
            <div className="card" key={svc.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{svc.title}</h3>
                <span className={`badge ${svc.active ? 'badge-success' : 'badge-secondary'}`}>
                  {svc.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {svc.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  {svc.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span><strong>₹{svc.price}</strong></span>
                {svc.durationMinutes && <span style={{ color: 'var(--text-secondary)' }}>⏱ {svc.durationMinutes} min</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(svc)}>Edit</button>
                {svc.active && (
                  <button className="btn btn-sm" style={{ background: 'var(--error)', color: '#fff' }} onClick={() => handleDeactivate(svc)}>
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, width: '95%' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {formError && <div className="banner banner-error" style={{ marginBottom: '1rem' }}>{formError}</div>}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input name="title" value={form.title} onChange={handleFormChange} className="form-input" placeholder="e.g., Deep House Cleaning" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" value={form.description ?? ''} onChange={handleFormChange} className="form-input" rows={3} placeholder="What does this service include?" style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input name="price" type="number" min="1" step="0.01" value={form.price} onChange={handleFormChange} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input name="durationMinutes" type="number" min="15" step="15" value={form.durationMinutes ?? ''} onChange={handleFormChange} className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleFormChange} className="form-input" required>
                    <option value="">Select category…</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
