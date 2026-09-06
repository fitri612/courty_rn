import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import { Booking, BookingStatusFilter, CreateBookingVariables, PaginatedResponse } from "../types";

export function useBookings(status: BookingStatusFilter) {
  return useQuery({
    queryKey: ["bookings", status],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Booking>>(endpoints.bookings, {
        params: { status },
      });
      return data.data;
    },
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Booking>(endpoints.booking(id as string));
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ facilityId: _facilityId, ...payload }: CreateBookingVariables) => {
      // facilityId is stripped here — it's not part of the API's request
      // body, only used below for cache invalidation.
      const { data } = await apiClient.post<Booking>(endpoints.bookings, payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["availability", variables.facilityId, variables.date],
      });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.booking(id));
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
  });
}