export type User = {
  userId: number;
  username: string;
  sex: string;
  birthdate: string;
  description: string;
  image: string | null;
  email: string;
  isAdmin: boolean;
};

export type UserStatus = {
  user: User | null;
  isLoading: boolean;
};
