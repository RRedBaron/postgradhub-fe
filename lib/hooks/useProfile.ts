import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api";

export const useProfile = () => {
  return useQuery({
    queryKey: ["users/me"],
    queryFn: getProfile,
    retry: false,
  });
};
