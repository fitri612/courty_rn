import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import { Sport } from "../types";

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
