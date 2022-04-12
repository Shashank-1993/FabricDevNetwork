"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const TransactionContext_1 = require("../context/TransactionContext");
class TransactionContract extends fabric_contract_api_1.Contract {
    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('com.tequre.blockchain.transaction');
    }
    createContext() {
        return new TransactionContext_1.TransactionContext();
    }
    async init(transactionContext) {
        console.log('Initializing transaction contract');
    }
    async beforeTransaction(transactionContext) {
        console.log('Parameters are ' + transactionContext.stub.getStringArgs());
    }
    async afterTransaction(transactionContext, result) {
        console.log('Result is :' + result);
    }
    async query(transactionContext, query, pageSize, bookMark) {
        if (!query) {
            throw new Error('Query cannot be null');
        }
        if (!bookMark) {
            bookMark = '';
        }
        const queryResponse = await transactionContext.transactionService.queryWithPagination(query, parseInt(pageSize, 10), bookMark);
        return JSON.stringify(queryResponse);
    }
    async delete(transactionContext, id) {
        if (!id) {
            throw new Error('Id cannot be null');
        }
        await transactionContext.transactionService.delete(id);
        const message = `Wallet deleted with id : ${id}`;
        transactionContext.transactionService.raiseEvent('TransactionDeleteEvent', Buffer.from(message));
        console.log(message);
    }
    async create(transactionContext, id, transactionTime, transactionId, externalTransactionId, transactionType, amount, entityId, entityType, externalId, discom, division, mobile, activity, vanId, agencyId, billId, consumerId) {
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
        const transactionEntity = await transactionContext.transactionService.create(id, parseInt(transactionTime, 10), transactionId, externalTransactionId, transactionType, parseFloat(amount), entityId, entityType, externalId, discom, division, mobile, activity, vanId, agencyId, consumerId, billId);
        const message = `Transaction created with id : ${id}`;
        transactionContext.transactionService.raiseEvent('TransactionCreateEvent', Buffer.from(message));
        console.log(message);
        return JSON.stringify(transactionEntity);
    }
}
exports.TransactionContract = TransactionContract;
//# sourceMappingURL=TransactionContract.js.map