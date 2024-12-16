export interface Review{
    id: number;
    postId: number;
    feedback: string;
    dateCreated: Date;
    reviewer: string;
    reviewerId: string;
}