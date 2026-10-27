export type SpaceType = "desk" | "meeting_room" | "private_office";

export interface SpaceDTO {
  id: string;
  name: string;
  description: string | null;
  type: SpaceType;
  pricePerHour: number;
  capacity: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

