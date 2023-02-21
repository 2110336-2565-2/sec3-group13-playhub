export type Appointment = {
    ownerId: string;
    ownerName: string;
    ownerProfilePic: string;
    location: string;
    startDateTime: string;
    endDateTime: string;
    participantAmount: number;
}

export const testAppointment: Appointment = {
    ownerId: "0000000",
    ownerName: "This is name",
    ownerProfilePic: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dplaceholder&psig=AOvVaw1Ma3DwnSApSgJbwMdBqMco&ust=1677058817426000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLizr4eppv0CFQAAAAAdAAAAABAE",
    location: "This is location",
    startDateTime: "2023-02-16T17:00:00+00:00",
    endDateTime: "2023-02-18T17:00:00+00:00",
    participantAmount: 20,
}