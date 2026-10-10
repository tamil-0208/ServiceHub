// Role types
export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

// User DTOs
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserResponse;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Category DTOs
export interface Category {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string;
}

// Provider Profile DTOs
export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  phone?: string;
  experience?: string;
  address?: string;
  bio?: string;
  city?: string;
  verified: boolean;
  rejectionReason?: string;
  createdAt?: string;
}

export interface ProviderRequest {
  businessName: string;
  description?: string;
  phone?: string;
  experience?: string;
  address?: string;
}

// Earnings DTOs
export interface EarningsResponse {
  providerId: string;
  totalEarnings: number;
  completedPaymentsCount: number;
}

// Service request DTO
export interface ServiceRequest {
  title: string;
  description?: string;
  price: number;
  durationMinutes?: number;
  categoryId: string;
}

// Schedule request DTO
export type WeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface ScheduleRequest {
  dayOfWeek: WeekDay;
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  available: boolean;
}

// Service Listing DTOs
export interface ServiceItem {
  id: string;
  providerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}

// Schedule DTOs
export interface Schedule {
  id: string;
  providerId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

// Address DTOs
export interface Address {
  id: string;
  userId: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface AddressRequest {
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

// Booking DTOs
export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BookingRequest {
  serviceId: string;
  addressId: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // HH:mm:ss or HH:mm
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  addressId?: string;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
  totalAmount: number;
  notes?: string;
  createdAt?: string;
}

// Review DTOs
export interface ReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Payment DTOs
export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  amount: number;
  platformCommission: number;
  providerPayout: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionId: string;
  paymentMethod: string;
  createdAt?: string;
}

// Notification DTOs
export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Invoice DTOs
export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  serviceTitle: string;
  amount: number;
  platformCommission: number;
  providerPayout: number;
  issuedAt: string;
}

// API Error Response
export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}

// Admin DTOs
export interface AdminAnalyticsSummary {
  totalUsers: number;
  totalProviders: number;
  verifiedProviders: number;
  unverifiedProviders: number;
  bookingsByStatus: Record<string, number>;
  totalRevenue: number;
}

// UserResponse (admin list uses this shape)
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
}
