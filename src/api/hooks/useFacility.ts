import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import { Facility } from "../types";

export function useFacility(id: string | undefined) {
  return useQuery({
    queryKey: ["facility", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Facility>(endpoints.facility(id as string));
      return data;
    },
    enabled: !!id,
  });
}
