export enum BookingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface CreateBookingDto {
  startDate: Date;
  endDate: Date;
  description?: string;
}

export interface Booking {
  id: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  status: BookingStatus;
  userId: string;
  approvedBy?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  approver?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
