import { Dayjs } from "dayjs";

export type Appointment = {
  appointmentId: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerProfilePic: string;
  location: string;
  startDateTime: Dayjs;
  endDateTime: Dayjs;
  participantAmount: number;
};

export type AppointmentDetail = {
  detailHeader: AppointmentDetailHeader;
  ownerId: string;
  images: string[];
  participantAmount: number;
  pendingParticipants: string[];
  acceptParticipants: string[];
  rejectParticipants: string[];
};

export type AppointmentDetailHeader = {
  title: string;
  location: string;
  startDateTime: Dayjs;
  endDateTime: Dayjs;
  tags: string[];
  description: string;
};
