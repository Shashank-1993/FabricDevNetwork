export class QueryResponse<T> {
    public recordCount: number;
    public nextPageToken: string;
    public result: T[];
}
