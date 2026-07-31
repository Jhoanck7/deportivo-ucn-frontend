export type CourtStatus = 'Available' | 'Disabled' | 'UnderMaintenance';

export interface Court {
  id: number;
  name: string;
  description: string;
  status: CourtStatus;
  pricePerHour: number;
}
export interface CreateCourtRequest {
  name: string;
  description: string;
  status: CourtStatus;
  pricePerHour: number;
}