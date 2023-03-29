export type ReviewExtend = {
    reviewerName: string;
    appointmentTitle: string;
    score: number;
    description: string;
    isAnonymous: boolean;
}

export type Review = {
    id: number;
    score: number;
    description: string;
    isAnonymous: boolean;
}