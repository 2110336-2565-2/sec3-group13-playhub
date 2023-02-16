import { Dayjs } from "dayjs";
import { Tag } from "./Tag";

export type Post = {
  post_id: number;
  title: string;
  user_id: string;
  ownerName: string;
  ownerProfilePic: string;
  tags: string[];
  description: string;
  image: string[];
  location: string;
  startDateTime: string;
  endDateTime: string;
};

export type PostInfo = {
  title: string;
  user_id: string | undefined;
  location: string;
  tags: Tag[];
  description: string;
  images: string[];
  start_time: Dayjs | null;
  end_time: Dayjs | null;
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
