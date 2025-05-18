import { User } from "@/lib/types/user";
import api from "@/lib/utils/axios";

export const getProfile = async (): Promise<User> => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateProfile = async (data: User): Promise<User> => {
  const response = await api.patch("/users/me", data);
  return response.data;
};

export const deleteProfile = async (): Promise<void> => {
  const response = await api.delete("/users/me");
  return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
