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