import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import { Sport } from "../types";

/**
 * Sports rarely change, so cache aggressively (30 min) instead of refetching
 * every time the facilities screen mounts.
 */
export function useSports() {
  return useQuery({
    queryKey: ["sports"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Sport[] }>(endpoints.sports);
      return data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}
