import { Booking, CreateBookingDto, BookingStatus } from "../types/booking";
import api from "@/lib/utils/axios";

export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get("/bookings");
  return response.data;
};

export const createBooking = async (
  data: CreateBookingDto
): Promise<Booking> => {
  const bookingData = {
    ...data,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
  };

  try {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create booking");
  }
};

export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    await api.delete(`/bookings/${bookingId}`);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete booking");
  }
};

export const updateBookingStatus = async ({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}): Promise<Booking> => {
  try {
    const response = await api.put(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update booking status");
  }
};
