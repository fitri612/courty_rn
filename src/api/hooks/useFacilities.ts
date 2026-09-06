import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import { Facility, FacilityFilters, PaginatedResponse } from "../types";

/**
 * Infinite-scroll friendly facility list. Pass search/sport/city filters and
 * this handles pagination via `fetchNextPage`.
 */
export function useFacilities(filters: Omit<FacilityFilters, "page">) {
  return useInfiniteQuery({
    queryKey: ["facilities", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Facility>>(
        endpoints.facilities,
        { params: { ...filters, page: pageParam, limit: filters.limit ?? 10 } }
      );

      console.log("facilities", data);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}
