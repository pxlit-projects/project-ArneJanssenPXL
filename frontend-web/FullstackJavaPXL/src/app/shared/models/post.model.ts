export interface Post{
    id: number;
    title: string;
    content: string;
    category: string;
    postStatus: string;
    author: string;
    authorId: number;
    dateCreated: Date;
    datePublished: Date;
}