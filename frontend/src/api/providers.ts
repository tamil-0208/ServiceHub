import client from './client';
import type {
  Provider,
  ServiceItem,
  Schedule,
  Booking,
  Notification,
  EarningsResponse,
  ServiceRequest,
  ScheduleRequest,
  ProviderRequest,
} from '../types';

// ── Provider Profile ──────────────────────────────────────────
export const getMyProviderProfile = () =>
  client.get<Provider>('/api/providers/me');

export const createProviderProfile = (data: ProviderRequest) =>
  client.post<Provider>('/api/providers', data);

// ── Services ──────────────────────────────────────────────────
export const getProviderServices = (providerId: string) =>
  client.get<ServiceItem[]>(`/api/providers/${providerId}/services`);

export const createService = (data: ServiceRequest) =>
  client.post<ServiceItem>('/api/services', data);

export const updateService = (id: string, data: ServiceRequest) =>
  client.put<ServiceItem>(`/api/services/${id}`, data);

export const deleteService = (id: string) =>
  client.delete(`/api/services/${id}`);

// ── Schedule ──────────────────────────────────────────────────
export const getProviderSchedule = (providerId: string) =>
  client.get<Schedule[]>(`/api/providers/${providerId}/schedule`);

export const createScheduleSlot = (data: ScheduleRequest) =>
  client.post<Schedule>('/api/providers/me/schedule', data);

export const updateScheduleSlot = (id: string, data: ScheduleRequest) =>
  client.put<Schedule>(`/api/providers/me/schedule/${id}`, data);

export const deleteScheduleSlot = (id: string) =>
  client.delete(`/api/providers/me/schedule/${id}`);

// ── Provider Bookings ─────────────────────────────────────────
export const getProviderBookings = () =>
  client.get<Booking[]>('/api/bookings/provider/me');

export const acceptBooking = (id: string) =>
  client.put<Booking>(`/api/bookings/${id}/accept`);

export const rejectBooking = (id: string) =>
  client.put<Booking>(`/api/bookings/${id}/reject`);

export const completeBooking = (id: string) =>
  client.put<Booking>(`/api/bookings/${id}/complete`);

// ── Earnings ──────────────────────────────────────────────────
export const getEarnings = () =>
  client.get<EarningsResponse>('/api/payments/provider/me/earnings');

// ── Notifications ─────────────────────────────────────────────
export const getNotifications = () =>
  client.get<Notification[]>('/api/notifications/me');

export const markNotificationRead = (id: string) =>
  client.put(`/api/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  client.put('/api/notifications/read-all');
