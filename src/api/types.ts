// ---- Auth ----
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Sport {
  id: string;
  name: string;
  slug: string;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  sports: string[];
  startingPrice: number;
  imageUrl?: string;
  description?: string;
  amenities?: string[];
  courts?: Court[];
}

export interface Court {
  id: string;
  name: string;
  sport: string;
  indoor: boolean;
  type: string;
  basePrice: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FacilityFilters {
  page?: number;
  limit?: number;
  search?: string;
  sport?: string; // slug, e.g. "badminton"
  city?: string;
}

export type CourtType = "STANDARD" | "PANORAMIC" | string;


export interface AvailabilitySlot {
  startTime: string; 
  endTime: string;
  price: number;
  available: boolean;
}

export interface AvailabilityCourt {
  id: string;
  name: string;
  type: CourtType;
  indoor: boolean;
  slots: AvailabilitySlot[];
}

export interface AvailabilityResponse {
  date: string;
  courts: AvailabilityCourt[];
}

// ---- DEFAULT Bookings ----
export type BookingStatusFilter = "UPCOMING" | "PAST" | "CANCELLED";
export type BookingRecordStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED" | string;
 
export interface Booking {
  id: string;
  bookingReference: string;
  status: BookingRecordStatus;
  facility: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  court: {
    id: string;
    name: string;
  };
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  totalPrice: number;
  price: number;
  serviceFee: number;
  createdAt: string;
  updatedAt: string;
}
 
export interface CreateBookingPayload {
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
}
 
export interface CreateBookingVariables extends CreateBookingPayload {
  facilityId: string;
}
