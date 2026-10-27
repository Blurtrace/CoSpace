export type ReservationStatus = "confirmed" | "cancelled";

export interface ReservationDTO {
  id: string;
  userId: string;
  spaceId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

