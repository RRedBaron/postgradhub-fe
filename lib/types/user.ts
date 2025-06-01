import { Gender, Role } from "@/types/default";
import { Group } from "./assignment";
import { Assignment } from "./assignment";
import { UserAssignment } from "./assignment";

export interface User {
  id: string;
  firstName: string;
  secondName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  currentHashedRefreshToken?: string | null;
  gender: Gender;
  groupId?: string | null;
  group?: Group | null;
  comments: Comment[];
  assignments: UserAssignment[];
  authoredAssignments: Assignment[];
  deletedAt?: string | null;
  isDeleted: boolean;
}
