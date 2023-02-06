export type User = {
  username: string;
  name: string;
  sex: string;
  birthdate: string;
  description: string;
  image: string;
  email: string;
};

export type UserStatus = {
  user: User | null;
  isLoading: boolean;
};