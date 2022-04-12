import { Context } from 'fabric-contract-api';
import { QueryResponse } from '../model/QueryResponse';
import { TransactionEntity } from '../model/TransactionEntity';

export class TransactionService {
    private TRANSACTION_OBJECT_TYPE: string = 'transactionId~vanId~txId';
    private readonly context: Context;

    constructor(context: Context) {
        this.context = context;
        console.log('Initializing transaction service');
    }

    public raiseEvent(eventName: string, payload: Buffer) {
        this.context.stub.setEvent(eventName, payload);
    }

    public async delete(id: string) {
        await this.context.stub.deleteState(id);
    }

    public async get(id: string): Promise<TransactionEntity> {
        const transactionBytes = await this.context.stub.getState(id);

        if (!transactionBytes || transactionBytes.toString().length <= 0) {
            return new Promise(() => null);
        } else {
            return JSON.parse(transactionBytes.toLocaleString());
        }
    }

    public async create(id: string, transactionTime: number, transactionId: string, externalTransactionId: string, transactionType: string, amount: number, entityId: string,
        entityType: string, externalId: string, discom: string, division: string, mobile: string, activity: string,
        vanId: string, agencyId: string, billId: string, consumerId: string): Promise<TransactionEntity> {
        const transactionEntity: TransactionEntity = {
            id,
            activity,
            agencyId,
            amount,
            billId,
            consumerId,
            discom,
            division,
            docType: 'transaction',
            entityId,
            entityType,
            externalId,
            externalTransactionId,
            mobile,
            transactionId,
            transactionTime,
            transactionType,
            vanId,
        };

        console.log(`Persisting transaction ${JSON.stringify(transactionEntity)} with composite key: ${id}`);
        await this.context.stub.putState(id, Buffer.from(JSON.stringify(transactionEntity)));
        this.context.stub.setEvent('TransactionCreateEvent', Buffer.from(JSON.stringify(`Transaction created with  id: ${id} and van id : ${vanId}`)));
        return transactionEntity;
    }

    public async queryWithPagination(query: string, recordPerPage: number, bookMark: string): Promise<QueryResponse<TransactionEntity>> {
        const { iterator, metadata } = await this.context.stub.getQueryResultWithPagination(query, recordPerPage, bookMark);
        const allResults: TransactionEntity[] = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                let transactionEntity: TransactionEntity;
                try {
                    transactionEntity = JSON.parse(res.value.value.toString());
                } catch (err) {
                    console.log(err);
                }
                allResults.push(transactionEntity);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return {
                    nextPageToken: metadata.bookmark,
                    recordCount: metadata.fetchedRecordsCount,
                    result: allResults,
                };
            }
        }
    }
}
