/// <reference types="node" />
import { Context } from 'fabric-contract-api';
import { QueryResponse } from '../model/QueryResponse';
import { TransactionEntity } from '../model/TransactionEntity';
export declare class TransactionService {
    private TRANSACTION_OBJECT_TYPE;
    private readonly context;
    constructor(context: Context);
    raiseEvent(eventName: string, payload: Buffer): void;
    delete(id: string): Promise<void>;
    get(id: string): Promise<TransactionEntity>;
    create(id: string, transactionTime: number, transactionId: string, externalTransactionId: string, transactionType: string, amount: number, entityId: string, entityType: string, externalId: string, discom: string, division: string, mobile: string, activity: string, vanId: string, agencyId: string, billId: string, consumerId: string): Promise<TransactionEntity>;
    queryWithPagination(query: string, recordPerPage: number, bookMark: string): Promise<QueryResponse<TransactionEntity>>;
}
