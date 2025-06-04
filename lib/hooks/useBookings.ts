import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Booking, CreateBookingDto, BookingStatus } from "../types/booking";
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../api/bookings";

export const useGetBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
