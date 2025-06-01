import { AssignmentPriority, AssignmentStatus } from "./common";
import { User } from "./user";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  requirements: string[];
  attachments: string[];
  comments: Comment[];
  authorId: string;
  author: User;
  users: UserAssignment[];
  deletedAt?: string | null;
  isDeleted: boolean;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  author: User;
  assignmentId: string;
  assignment: Assignment;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isDeleted: boolean;
}

export enum Role {
  PhD = "PhD",
  SUPERVISOR = "SUPERVISOR",
  HEAD = "HEAD",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface Group {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  users: User[];
}

export interface UserAssignment {
  userId: string;
  assignmentId: string;
  assignedAt: string;
  dueDate?: string | null;
  user: User;
  assignment: Assignment;
}
