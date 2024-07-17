export default interface BaseModel<T> {
    status: number;
    message: string;
    data: T
}