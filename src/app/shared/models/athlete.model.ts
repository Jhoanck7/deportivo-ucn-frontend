export interface CreateAthleteRequest {
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  phone: string;
  birthDate: string;
  isActive: boolean;
  sportBranchId: number;
}

export interface Athlete {
  id: number;
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  phone: string;
  birthDate: string;
  isActive: boolean;
  sportBranchId: number;
  sportBranchName: string;
}