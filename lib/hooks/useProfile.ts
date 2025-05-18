import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  getUserById,
} from "../api/profile";
import { User } from "@/lib/types/user";

export const useProfile = () => {
  return useQuery({
    queryKey: ["users/me"],
    queryFn: getProfile,
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: User) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me"] });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me"] });
    },
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
