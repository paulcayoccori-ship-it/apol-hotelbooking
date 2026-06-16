export interface Notification {
  id?: number;
  userId: number;
  bookingId: number;
  type: string;
  channel: string;
  subject: string;
  message: string;
  status: string;
}
