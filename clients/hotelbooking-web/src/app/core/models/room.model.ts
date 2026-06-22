export interface Room {
  id?: number;
  roomNumber: string;
  type: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  status: string;
  imageUrl?: string;
  promotionActive?: boolean;
  promotionTitle?: string;
  promotionDescription?: string;
  discountPercent?: number;
  promotionPrice?: number;
}
