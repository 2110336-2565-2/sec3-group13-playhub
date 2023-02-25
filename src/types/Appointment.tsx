import { Dayjs } from "dayjs";
import { Tag } from "./Tag";
import { User } from "./User";
export type Appointment = {
    title: string,
    ownerId: string;
    ownerName: string;
    ownerProfilePic: string;
    location: string;
    startDateTime: string;
    endDateTime: string;
    participantAmount: number;
}

export type AppointmentDetail = {
    detailHeader: AppointmentDetailHeader,
    images: string[],
    participantAmount: number,
    pendingParticipants: User[],
    acceptParticipants: User[],
    rejectParticipants: User[]
}

export type AppointmentDetailHeader = {
    title: string,
    location: string,
    startDateTime: Dayjs | null,
    endDateTime: Dayjs | null,
    tags: Tag[],
    description: string
}
