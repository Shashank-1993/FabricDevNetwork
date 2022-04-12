export class TransactionEntity {
    public docType?: string;
    public id: string;
    public externalTransactionId: string;
    public transactionId: string;
    public transactionTime: number;
    public transactionType: string;
    public vanId: string;
    public amount: number;
    public entityId: string;
    public entityType: string;
    public externalId?: string;
    public activity: string;
    public discom?: string;
    public division?: string;
    public mobile?: string;
    public agencyId?: string;
    public consumerId?: string;
    public billId?: string;
}
