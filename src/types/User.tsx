export type User = {
  user_id: string;
  username: string;
  sex: string;
  birthdate: string;
  description: string;
  image: string | null;
  email: string;
  is_admin: boolean;
};

export type UserStatus = {
  user: User | null;
  isLoading: boolean;
};
