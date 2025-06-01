import { Booking, CreateBookingDto, BookingStatus } from "../types/booking";
import api from "@/lib/utils/axios";

export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get("/bookings");
  return response.data;
};

export const createBooking = async (
  data: CreateBookingDto
): Promise<Booking> => {
  const response = await api.post("/bookings", data);
  return response.data;
};

export const updateBookingStatus = async ({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}): Promise<Booking> => {
  const response = await api.put(`/bookings/${bookingId}/status`, { status });
  return response.data;
};
