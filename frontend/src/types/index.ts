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
  bio?: string;
  address?: string;
  city?: string;
  verified: boolean;
  rejectionReason?: string;
  createdAt?: string;
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

// Booking DTOs
export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

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
