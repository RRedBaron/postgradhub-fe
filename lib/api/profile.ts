import { User } from "@/lib/types/user";
import api from "@/lib/utils/axios";

export const getProfile = async (): Promise<User> => {
  const response = await api.get("/users/me");
  return response.data;
};
