import api from "@/lib/utils/axios";
import { Assignment } from "../types/assignment";

export const getAssignments = async (): Promise<Assignment[]> => {
  const response = await api.get("/assignments");
  return response.data;
};

export const getAssignmentById = async (id: string): Promise<Assignment> => {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
};

export const createAssignment = async (
  assignment: Assignment
): Promise<Assignment> => {
  const response = await api.post("/assignments", assignment);
  return response.data;
};
