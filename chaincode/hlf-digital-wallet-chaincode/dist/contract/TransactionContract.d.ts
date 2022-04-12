import { Context, Contract } from 'fabric-contract-api';
import { TransactionContext } from '../context/TransactionContext';
export declare class TransactionContract extends Contract {
    constructor();
    createContext(): Context;
    init(transactionContext: TransactionContext): Promise<void>;
    beforeTransaction(transactionContext: TransactionContext): Promise<void>;
    afterTransaction(transactionContext: any, result: any): Promise<void>;
    query(transactionContext: TransactionContext, query: string, pageSize: string, bookMark: string): Promise<string>;
    delete(transactionContext: TransactionContext, id: string): Promise<void>;
    create(transactionContext: TransactionContext, id: string, transactionTime: string, transactionId: string, externalTransactionId: string, transactionType: string, amount: string, entityId: string, entityType: string, externalId: string, discom: string, division: string, mobile: string, activity: string, vanId: string, agencyId: string, billId: string, consumerId: string): Promise<string>;
}
