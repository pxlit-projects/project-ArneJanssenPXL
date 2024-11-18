export class Post{
    author: string;
    content: string;
    datePublished: Date;
    isConcept: boolean;
    title: string;
    category: string;
    id?: number;
    
    constructor(author: string, content: string, datePublished: Date, isConcept: boolean, title: string, category: string) {
        this.author = author;
        this.content = content;
        this.datePublished = datePublished;
        this.isConcept = isConcept;
        this.title = title;
        this.category = category;
    }
}