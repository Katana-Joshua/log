// User related types
export type UserRole = 'client' | 'transporter' | 'admin' | 'finance';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  avatar?: string;
  rating?: number;
  totalJobs?: number;
  wallet?: Wallet;
}

export interface TransporterProfile extends UserProfile {
  vehicleType?: string;
  vehicleNumber?: string;
  isAvailable?: boolean;
  currentLocation?: Location;
  kycStatus: 'pending' | 'approved' | 'rejected';
  kycDocuments?: KYCDocument[];
}

export interface ClientProfile extends UserProfile {
  company?: string;
  address?: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  session: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Job types
export type JobStatus = 
  | 'draft' 
  | 'pending' 
  | 'accepted' 
  | 'picked_up' 
  | 'in_transit' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled';

export interface Job {
  id: string;
  clientId: string;
  transporterId?: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  description?: string;
  price: number;
  status: JobStatus;
  vehicleTypeId: number;
  createdAt: string;
  updatedAt: string;
  startTime?: string;
  endTime?: string;
  distance?: number;
  duration?: number;
  rating?: number;
  feedback?: string;
}

// Payment types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'escrow' | 'escrow_release' | 'fee';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  description?: string;
  createdAt: string;
}

export interface Escrow {
  id: string;
  jobId: string;
  amount: number;
  status: 'held' | 'released' | 'refunded';
  createdAt: string;
}

// Vehicle types
export interface VehicleType {
  id: number;
  name: string;
  capacity: number;
  baseRate: number;
  perKmRate: number;
  image?: string;
}

// KYC types
export interface KYCDocument {
  id: string;
  userId: string;
  documentType: 'id' | 'license' | 'registration' | 'insurance' | 'other';
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  submittedAt: string;
  reviewedAt?: string;
}

// Rating types
export interface Rating {
  id: string;
  jobId: string;
  raterId: string;
  rateeId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job' | 'payment' | 'system';
  isRead: boolean;
  createdAt: string;
}

// Tracking types
export interface TrackingRecord {
  id: string;
  jobId: string;
  location: Location;
  timestamp: string;
}