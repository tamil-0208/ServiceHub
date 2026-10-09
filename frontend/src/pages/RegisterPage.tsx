import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { UserRequest, UserResponse } from '../types';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserRequest>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (min 6 chars to mirror backend @Size(min = 6))
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error upon typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await apiClient.post<UserResponse>('/api/users/register', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Redirect to login page with success notification state
      navigate('/login', {
        state: {
          successMessage: 'Account created successfully! Please sign in with your credentials.',
          prefilledEmail: formData.email.trim().toLowerCase(),
        },
      });
    } catch (err: any) {
      console.error('Registration failed:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please check your details and try again.';

      // Parse field-level backend validation errors if returned in standard format (e.g., "name: ...; password: ...")
      const parsedErrors: FormErrors = {};
      if (typeof errorMessage === 'string') {
        if (errorMessage.toLowerCase().includes('email already registered')) {
          parsedErrors.email = 'This email is already registered. Please sign in instead.';
        } else if (errorMessage.includes(':')) {
          const parts = errorMessage.split(';');
          parts.forEach((part) => {
            const [field, ...msgParts] = part.trim().split(':');
            const fieldKey = field?.trim().toLowerCase();
            const msg = msgParts.join(':').trim();
            if (fieldKey === 'name') parsedErrors.name = msg;
            else if (fieldKey === 'email') parsedErrors.email = msg;
            else if (fieldKey === 'password') parsedErrors.password = msg;
          });
        }
      }

      setErrors({
        ...parsedErrors,
        general:
          Object.keys(parsedErrors).length > 0
            ? undefined
            : errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '2rem auto' }} className="card">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ fontSize: '1.75rem' }}>Create an Account</h1>
        <p className="card-subtitle">
          Join Hypermarketplace to book and manage local home services.
        </p>
      </div>

      {errors.general && (
        <div className="banner banner-error">
          <span>⚠️</span>
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="register-name">
            Full Name *
          </label>
          <input
            id="register-name"
            type="text"
            name="name"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="name"
            required
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="register-email">
            Email Address *
          </label>
          <input
            id="register-email"
            type="email"
            name="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="email"
            required
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="register-password">
            Password *
          </label>
          <input
            id="register-password"
            type="password"
            name="password"
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="new-password"
            required
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
          style={{ marginTop: '1.5rem', padding: '0.75rem' }}
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ fontWeight: 600 }}>
          Sign in
        </Link>
      </div>
    </div>
  );
};
