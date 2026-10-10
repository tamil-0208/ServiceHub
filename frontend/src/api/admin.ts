import client from './client';
import type {
  AdminAnalyticsSummary,
  PageResponse,
  UserResponse,
  Provider,
  Booking,
  Payment,
  Review,
  Category,
} from '../types';

// ── Analytics ───────────────────────────────────────────────
export const getAnalyticsSummary = () =>
  client.get<AdminAnalyticsSummary>('/api/admin/analytics/summary');

// ── Users ────────────────────────────────────────────────────
export const adminGetUsers = (page = 0, size = 10) =>
  client.get<PageResponse<UserResponse>>(`/api/admin/users?page=${page}&size=${size}`);

// ── Providers ────────────────────────────────────────────────
export const adminGetAllProviders = () =>
  client.get<Provider[]>('/api/providers');

export const adminVerifyProvider = (id: string) =>
  client.put<Provider>(`/api/admin/providers/${id}/verify`);

export const adminRejectProvider = (id: string, reason: string) =>
  client.put<Provider>(`/api/admin/providers/${id}/reject`, { reason });

// ── Bookings ─────────────────────────────────────────────────
export const adminGetBookings = (status?: string, page = 0, size = 10) => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status && status !== 'ALL') params.set('status', status);
  return client.get<PageResponse<Booking>>(`/api/admin/bookings?${params.toString()}`);
};

// ── Payments ─────────────────────────────────────────────────
export const adminGetPayments = (status?: string, page = 0, size = 10) => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status && status !== 'ALL') params.set('status', status);
  return client.get<PageResponse<Payment>>(`/api/admin/payments?${params.toString()}`);
};

// ── Reviews ──────────────────────────────────────────────────
export const adminGetReviews = (page = 0, size = 10) =>
  client.get<PageResponse<Review>>(`/api/admin/reviews?page=${page}&size=${size}`);

export const adminDeleteReview = (id: string) =>
  client.delete(`/api/admin/reviews/${id}`);

// ── Categories ───────────────────────────────────────────────
export const adminGetCategories = () =>
  client.get<Category[]>('/api/categories');

export const adminCreateCategory = (data: { name: string; description?: string }) =>
  client.post<Category>('/api/categories', data);

export const adminUpdateCategory = (id: string, data: { name: string; description?: string }) =>
  client.put<Category>(`/api/categories/${id}`, data);

export const adminDeleteCategory = (id: string) =>
  client.delete(`/api/categories/${id}`);
