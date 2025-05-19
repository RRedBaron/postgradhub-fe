import { Gender, Role } from "@/types/default";

export interface User {
  id: string;
  email: string;
  firstName: string;
  secondName: string;
  lastName: string;
  gender?: Gender;
  phone?: string;
  group?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
