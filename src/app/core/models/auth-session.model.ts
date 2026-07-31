import { UserRole } from './user.model';
export interface AuthSession {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}