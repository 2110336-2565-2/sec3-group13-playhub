import { Dayjs } from "dayjs";
import { Tag } from "./Tag";

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
  participants?: {
    id: string;
    username: string;
    sex: string;
    isVerified: boolean;
    birthdate: string;
    description: string;
    image: string | null;
  }[];
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
  participants?: {
    id: string;
    username: string;
    sex: string;
    isVerified: boolean;
    birthdate: string;
    description: string;
    image: string | null;
  }[];
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
