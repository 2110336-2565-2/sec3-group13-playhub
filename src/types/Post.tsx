export type Post = {
  title: string;
  ownerName: string;
  ownerProfilePic: string;
  tags: string[];
  description: string;
  image: string[];
  location: string;
  startDateTime: string;
  endDateTime: string;
};
export const emptyPost: Post = {
  title: "",
  ownerName: "",
  ownerProfilePic: "",
  tags: [],
  description: "",
  image: [],
  location: "",
  startDateTime: "",
  endDateTime: "",
};
