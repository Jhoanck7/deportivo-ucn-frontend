export type UserRole = 'User' | 'Coach' | 'Admin';
export interface AuthUserData {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
export interface LoginRequest {
  emailOrRut: string;
  password: string;
}
export interface RegisterRequest {
  rut: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: UserRole;
}
export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  // TODO: completar según respuesta real del backend
}
export interface BanUserRequest {
  isBanned: boolean;
  banReason: string;
}