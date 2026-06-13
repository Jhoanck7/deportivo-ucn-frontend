export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Cancelled'
  | 'Completed'
  | 'NoShow';

export interface AvailabilitySlot {
  startHour: number;
  endHour: number;
  isAvailable: boolean;
}

export interface CreateBookingRequest {
  courtId: number;
  date: string;
  startHour: number;
  depositAmount: number;
}

export interface Booking {
  id: number;
  courtId: number;
  courtName: string;
  userId: number;
  userFullName: string;
  userPhone: string;
  date: string;
  startHour: number;
  endHour: number;
  status: BookingStatus;
  depositAmount: number;
  totalPrice: number;
  whatsAppLink: string;
  adminNotes: string | null;
  createdAt: string;
}