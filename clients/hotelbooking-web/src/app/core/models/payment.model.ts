export interface Payment {
  id?: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionCode: string;
}
