import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssignment,
  getAssignmentById,
  getAssignments,
} from "../api/assignments";
import { Assignment } from "../types/assignment";

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
