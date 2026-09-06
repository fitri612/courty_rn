export const endpoints = {
  register: "/v1/auth/register",
  login: "/v1/auth/login",
  sports: "/v1/sports",
  facilities: "/v1/facilities",
  facility: (id: string) => `/v1/facilities/${id}`,
  availability: (id: string) => `/v1/facilities/${id}/availability`,
  bookings: "/v1/bookings",
  booking: (id: string) => `/v1/bookings/${id}`,
} as const;
