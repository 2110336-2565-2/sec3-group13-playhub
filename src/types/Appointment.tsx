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
    pendingParticipants: string[],
    acceptParticipants: string[],
    rejectParticipants: string[]
}

export type AppointmentDetailHeader = {
    title: string,
    location: string,
    startDateTime: string,
    endDateTime: string,
    tags: number[],
    description: string
}