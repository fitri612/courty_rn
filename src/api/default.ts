import { BookingStatusFilter } from "./types";

export const DEFAULT_TABS: { label: string; status: BookingStatusFilter }[] = [
  { label: "Upcoming", status: "UPCOMING" },
  { label: "Past", status: "PAST" },
  { label: "Cancelled", status: "CANCELLED" },
];