import { Dayjs } from "dayjs";
import { User } from "./User";

export type Appointment = {
  appointmentId: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerProfilePic: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  participantAmount: number;
};

export type AppointmentDetail = {
  detailHeader: AppointmentDetailHeader;
  ownerId: string;
  images: string[];
  participantAmount: number;
  pendingParticipants: User[];
  acceptParticipants: User[];
  rejectParticipants: User[];
};

export type AppointmentDetailHeader = {
  title: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  tags: string[];
  description: string;
};
