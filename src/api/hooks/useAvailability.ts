import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import { AvailabilityResponse } from "../types";

export function useAvailability(facilityId: string | undefined, date: string) {
  return useQuery({
    queryKey: ["availability", facilityId, date],
    queryFn: async () => {
      const { data } = await apiClient.get<AvailabilityResponse>(
        endpoints.availability(facilityId as string),
        { params: { date } }
      );
      return data;
    },
    enabled: !!facilityId && !!date,
  });
}