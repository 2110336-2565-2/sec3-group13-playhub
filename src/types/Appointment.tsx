import { Dayjs } from "dayjs";
import { Tag } from "./Tag";

export type AppointmentInfo = {
  userId: string;
  title: string;
  location: string;
  tags: Tag[];
  description: string;
  images: string[];
  startTime: Dayjs;
  endTime: Dayjs;
  selectedUsers: string[];
};
