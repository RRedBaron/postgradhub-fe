import { Role } from "@/types/default";

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  avatarUrl?: string;
  gender?: string;
  country?: string;
  language?: string;
  timezone?: string;
  phone?: string;
  group?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
