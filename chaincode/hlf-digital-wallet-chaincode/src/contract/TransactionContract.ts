import { Context, Contract } from 'fabric-contract-api';
import { TransactionContext } from '../context/TransactionContext';
import { QueryResponse } from '../model/QueryResponse';
import { TransactionEntity } from '../model/TransactionEntity';

export class TransactionContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('com.tequre.blockchain.transaction');
    }

    public createContext(): Context {
        return new TransactionContext();
    }

    public async init(transactionContext: TransactionContext) {
        console.log('Initializing transaction contract');
    }

    public async beforeTransaction(transactionContext: TransactionContext) {
        console.log('Parameters are ' + transactionContext.stub.getStringArgs());

    }

    public async afterTransaction(transactionContext, result: any) {
        console.log('Result is :' + result);
    }

    public async query(transactionContext: TransactionContext, query: string, pageSize: string, bookMark: string): Promise<string> {
        if (!query) {
            throw new Error('Query cannot be null');
        }
        if (!bookMark) {
            bookMark = '';
        }
        const queryResponse: QueryResponse<TransactionEntity> = await transactionContext.transactionService.queryWithPagination(query, parseInt(pageSize, 10), bookMark);
        return JSON.stringify(queryResponse);
    }

    public async delete(transactionContext: TransactionContext, id: string) {
        if (!id) {
            throw new Error('Id cannot be null');
        }
        await transactionContext.transactionService.delete(id);
        const message: string = `Wallet deleted with id : ${id}`;
        transactionContext.transactionService.raiseEvent('TransactionDeleteEvent', Buffer.from(message));
        console.log(message);
    }


    public async create(transactionContext: TransactionContext,
        id: string,
        transactionTime: string,
        transactionId: string,
        externalTransactionId: string,
        transactionType: string,
        amount: string,
        entityId: string,
        entityType: string,
        externalId: string,
        discom: string,
        division: string,
        mobile: string,
        activity: string,
        vanId: string,
        agencyId: string,
        billId: string,
        consumerId: string): Promise<string> {

        if (!id) {
            throw new Error('Id cannot be null');
        }
        if (!transactionTime) {
            throw new Error('Transaction time cannot be null');
        }
        if (!transactionId) {
            throw new Error('Transaction id cannot be null');
        }
        if (!externalTransactionId) {
            throw new Error('External transaction id cannot be null');
        }
        if (!amount) {
            throw new Error('Amount cannot be null');
        }
        if (parseFloat(amount) < 0.0) {
            throw new Error('Amount cannot be negative');
        }
        if (!entityType) {
            throw new Error('Entity type cannot be null');
        }
        if (!entityId) {
            throw new Error('Entity id cannot be null');
        }
        if (!vanId) {
            throw new Error('Van id can not be null');
        }
        const transactionEntity: TransactionEntity = await transactionContext.transactionService.create(id, parseInt(transactionTime, 10),
            transactionId, externalTransactionId, transactionType, parseFloat(amount), entityId, entityType, externalId, discom, division, mobile, activity, vanId, agencyId, consumerId, billId);
        const message: string = `Transaction created with id : ${id}`;
        transactionContext.transactionService.raiseEvent('TransactionCreateEvent', Buffer.from(message));
        console.log(message);
        return JSON.stringify(transactionEntity);
    }
}
