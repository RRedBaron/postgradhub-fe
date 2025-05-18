import { Gender, Role } from "@/types/default";

export interface User {
  id: string;
  email: string;
  firstname: string;
  secondname: string;
  lastname: string;
  nickname?: string;
  avatarUrl?: string;
  gender?: Gender;
  phone?: string;
  group?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
