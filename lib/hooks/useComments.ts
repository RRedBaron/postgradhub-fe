import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getComments,
  createComment as createCommentApi,
} from "../api/comments";

export const useGetComments = (assignmentId: string) => {
  return useQuery({
    queryKey: ["comments", assignmentId],
    queryFn: () => getComments(assignmentId),
    enabled: !!assignmentId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      text: string;
      assignmentId: string;
      authorId: string;
    }) => createCommentApi(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.assignmentId],
      });
    },
  });
};
