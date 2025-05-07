"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, register } from "@/lib/api";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/lib/types/auth";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users/me"] });
      queryClient.setQueryData(["users/me"], null);
    },
  });
};
