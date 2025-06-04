import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssignment,
  getAssignmentById,
  getAssignments,
  submitAssignment,
  gradeAssignment,
  getSubmissions,
  getSubmissionById,
} from "../api/assignments";
import { Assignment, AssignmentSubmission } from "../types/assignment";

export const useGetAssignments = () => {
  return useQuery({ queryKey: ["assignments"], queryFn: getAssignments });
};

export const useGetAssignmentById = (id: string) => {
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: () => getAssignmentById(id),
    retry: false,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignment: Assignment) => createAssignment(assignment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      files,
    }: {
      assignmentId: string;
      files: string[];
    }) => submitAssignment(assignmentId, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", variables.assignmentId],
      });
    },
  });
};

export const useGradeAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string;
      data: { grade: number; feedback: string };
    }) => gradeAssignment(submissionId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", data.assignmentId],
      });
    },
  });
};

export const useGetSubmissions = (assignmentId: string) => {
  return useQuery({
    queryKey: ["submissions", assignmentId],
    queryFn: () => getSubmissions(assignmentId),
    enabled: !!assignmentId,
  });
};

export const useGetSubmissionById = (submissionId: string) => {
  return useQuery({
    queryKey: ["submissions", submissionId],
    queryFn: () => getSubmissionById(submissionId),
    enabled: !!submissionId,
  });
};
