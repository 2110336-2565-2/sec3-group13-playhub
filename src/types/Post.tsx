import { Dayjs } from "dayjs";
import { Tag } from "./Tag";
import { User } from "./User";

export type Post = {
  postId: number;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerProfilePic: string;
  tags: string[];
  description: string;
  image: string[];
  location: string;
  startDateTime: string;
  endDateTime: string;
  participants?: User[];
};

export type PostInfo = {
  title: string;
  userId: string;
  location: string;
  tags: Tag[];
  description: string;
  images: string[];
  startTime: Dayjs;
  endTime: Dayjs;
  participants?: User[];
};

// export const emptyPost: Post = {
//   title: "",
//   ownerName: "",
//   ownerProfilePic: "",
//   tags: [],
//   description: "",
//   image: [],
//   location: "",
//   startDateTime: "",
//   endDateTime: "",
// };
