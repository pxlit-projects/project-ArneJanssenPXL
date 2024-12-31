export interface Comment{
    id: number;
    postId: number;
    text: string;
    dateCreated: Date;
    commenter: string;
    commenterId: number;
}