import api from "@/lib/utils/axios";
import { Assignment, AssignmentSubmission } from "../types/assignment";

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

export const submitAssignment = async (
  assignmentId: string,
  files: string[]
): Promise<AssignmentSubmission> => {
  const response = await api.post(`/assignments/${assignmentId}/submit`, {
    files,
  });
  return response.data;
};

export const gradeAssignment = async (
  submissionId: string,
  data: {
    grade: number;
    feedback: string;
  }
): Promise<AssignmentSubmission> => {
  const response = await api.post(`/submissions/${submissionId}/grade`, data);
  return response.data;
};

export const getSubmissions = async (
  assignmentId: string
): Promise<AssignmentSubmission[]> => {
  const response = await api.get(`/assignments/${assignmentId}/submissions`);
  return response.data;
};

export const getSubmissionById = async (
  submissionId: string
): Promise<AssignmentSubmission> => {
  const response = await api.get(`/submissions/${submissionId}`);
  return response.data;
};
