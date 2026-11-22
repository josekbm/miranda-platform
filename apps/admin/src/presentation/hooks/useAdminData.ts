import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingStatus } from "../../domain/bookings/status";
import type { BookingFilters } from "../../domain/bookings/types";
import type { AdminContactStatus } from "../../domain/contacts/types";
import { container } from "../../infrastructure/repositories";

export const queryKeys = {
  overview: ["overview"] as const,
  bookings: (filters: BookingFilters) => ["bookings", filters] as const,
  rooms: ["rooms"] as const,
  contacts: ["contacts"] as const,
  users: ["users"] as const,
};

export function useOverview() {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: () => container.stats.getOverview(),
  });
}

export function useBookings(filters: BookingFilters) {
  return useQuery({
    queryKey: queryKeys.bookings(filters),
    queryFn: () => container.bookings.list(filters),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      container.bookings.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
  });
}

export function useRooms() {
  return useQuery({
    queryKey: queryKeys.rooms,
    queryFn: () => container.rooms.list(),
  });
}

export function useContacts() {
  return useQuery({
    queryKey: queryKeys.contacts,
    queryFn: () => container.contacts.list(),
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminContactStatus }) =>
      container.contacts.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["contacts"] });
      void queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => container.users.list(),
  });
}
