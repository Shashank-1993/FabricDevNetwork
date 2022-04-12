"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
class TransactionService {
    constructor(context) {
        this.TRANSACTION_OBJECT_TYPE = 'transactionId~vanId~txId';
        this.context = context;
        console.log('Initializing transaction service');
    }
    raiseEvent(eventName, payload) {
        this.context.stub.setEvent(eventName, payload);
    }
    async delete(id) {
        await this.context.stub.deleteState(id);
    }
    async get(id) {
        const transactionBytes = await this.context.stub.getState(id);
        if (!transactionBytes || transactionBytes.toString().length <= 0) {
            return new Promise(() => null);
        }
        else {
            return JSON.parse(transactionBytes.toLocaleString());
        }
    }
    async create(id, transactionTime, transactionId, externalTransactionId, transactionType, amount, entityId, entityType, externalId, discom, division, mobile, activity, vanId, agencyId, billId, consumerId) {
        const transactionEntity = {
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
    async queryWithPagination(query, recordPerPage, bookMark) {
        const { iterator, metadata } = await this.context.stub.getQueryResultWithPagination(query, recordPerPage, bookMark);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                let transactionEntity;
                try {
                    transactionEntity = JSON.parse(res.value.value.toString());
                }
                catch (err) {
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
exports.TransactionService = TransactionService;
//# sourceMappingURL=TransactionService.js.map