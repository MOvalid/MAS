import { ApiUser } from "../api";

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
};

export function mapApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email,
    avatar: apiUser.avatar_url,
  };
}
