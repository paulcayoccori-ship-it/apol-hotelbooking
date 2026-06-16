export interface Room {
  id?: number;
  roomNumber: string;
  type: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  status: string;
}
