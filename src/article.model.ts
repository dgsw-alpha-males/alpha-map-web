export default interface ArticleModel {
    id: number;
    tag: string;
    latitude: number;
    hardness: number;
    title: string;
    content: string;
    createdAt: string;
    scale?: number;
    alt?: number;
    imgUrl: string;
}