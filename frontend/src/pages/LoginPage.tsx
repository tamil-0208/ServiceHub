import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest, LoginResponse } from '../types';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Retrieve any state passed from previous navigation (e.g., registration success message)
  const state = location.state as {
    successMessage?: string;
    prefilledEmail?: string;
    from?: { pathname: string };
  } | null;

  const [formData, setFormData] = useState<LoginRequest>({
    email: state?.prefilledEmail || '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors] || errors.general) {
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
      const response = await apiClient.post<LoginResponse>('/api/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const { token, user } = response.data;

      // Update global AuthContext (which also stores token and user in localStorage)
      login(token, user);

      // Redirect to destination or default to /dashboard
      const destination = state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to log in. Please check your email and password.';

      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '2rem auto' }} className="card">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ fontSize: '1.75rem' }}>Sign In</h1>
        <p className="card-subtitle">
          Welcome back! Access your bookings, profile, and services.
        </p>
      </div>

      {/* Success alert from registration */}
      {state?.successMessage && !errors.general && (
        <div className="banner banner-success">
          <span>✅</span>
          <span>{state.successMessage}</span>
        </div>
      )}

      {/* Error alert from server / validation */}
      {errors.general && (
        <div className="banner banner-error">
          <span>⚠️</span>
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">
            Email Address *
          </label>
          <input
            id="login-email"
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" htmlFor="login-password">
              Password *
            </label>
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="current-password"
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
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ fontWeight: 600 }}>
          Create an account
        </Link>
      </div>
    </div>
  );
};
