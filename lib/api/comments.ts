import api from "@/lib/utils/axios";
import { Comment } from "../types/assignment";

export const getComments = async (assignmentId: string): Promise<Comment[]> => {
  const response = await api.get(`/comments/${assignmentId}`);
  return response.data;
};

export const createComment = async (data: {
  text: string;
  assignmentId: string;
}): Promise<Comment> => {
  const response = await api.post("/comments", data);
  return response.data;
};

export const deleteComment = async (id: string): Promise<void> => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};
