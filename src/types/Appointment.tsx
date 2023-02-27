import { Dayjs } from "dayjs";

export type Appointment = {
    title: string,
    ownerId: string;
    ownerName: string;
    ownerProfilePic: string;
    location: string;
    startDateTime: Dayjs;
    endDateTime: Dayjs;
    participantAmount: number;
}

export type AppointmentDetail = {
    detailHeader: AppointmentDetailHeader,
    images: string[],
    participantAmount: number,
    pendingParticipants: string[],
    acceptParticipants: string[],
    rejectParticipants: string[]
}

export type AppointmentDetailHeader = {
    title: string,
    location: string,
    startDateTime: Dayjs,
    endDateTime: Dayjs,
    tags: string[],
    description: string
}