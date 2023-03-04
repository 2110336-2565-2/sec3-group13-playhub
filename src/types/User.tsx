export type User = {
  userId: string;
  username: string;
  sex: string;
  birthdate: string;
  description: string;
  image: string | null;
  email: string;
  isAdmin: boolean;
  isVerified?: boolean;
};

export type UserStatus = {
  user: User | null;
  isLoading: boolean;
};
