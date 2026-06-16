export interface Booking {
  id?: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
}
