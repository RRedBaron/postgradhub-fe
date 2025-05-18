import { Gender, Role } from "@/types/default";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  secondName: string;
  email: string;
  phone?: string;
  password: string;
  role?: Role;
  gender: Gender;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: Role;
  };
}
