export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  avatarUrl?: string;
  gender?: string;
  country?: string;
  language?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}
