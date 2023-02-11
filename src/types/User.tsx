export type User = {
  user_id: string;
  username: string;
  name: string;
  sex: string;
  birthdate: string;
  description: string;
  image: string | null;
  email: string;
};

export type UserStatus = {
  user: User | null;
  isLoading: boolean;
};