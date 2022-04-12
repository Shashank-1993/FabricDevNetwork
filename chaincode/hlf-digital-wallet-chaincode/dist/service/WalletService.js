"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
class WalletService {
    constructor(context) {
        this.context = context;
        console.log('Initializing wallet service');
    }
    async create(vanId, balance, walletType, walletStatus) {
        const wallet = {
            balance,
            docType: 'wallet',
            vanId,
            walletStatus,
            walletType,
        };
        console.log(`Creating wallet with ID : ${vanId}`);
        await this.context.stub.putState(vanId, Buffer.from(JSON.stringify(wallet)));
        return wallet;
    }
    async update(vanId, balance, walletType, walletStatus) {
        const walletBytes = await this.context.stub.getState(vanId);
        const wallet = JSON.parse(walletBytes.toLocaleString());
        wallet.balance = balance;
        wallet.walletStatus = walletStatus;
        wallet.walletType = walletType;
        console.log(`Updating wallet with ID : ${vanId}`);
        await this.context.stub.putState(vanId, Buffer.from(JSON.stringify(wallet)));
        return wallet;
    }
    raiseEvent(eventName, payload) {
        this.context.stub.setEvent(eventName, payload);
    }
    async delete(vanId) {
        await this.context.stub.deleteState(vanId);
    }
    async exists(vanId) {
        const walletBytes = await this.context.stub.getState(vanId);
        return walletBytes && walletBytes.toLocaleString().length > 0;
    }
    async get(vanId) {
        const walletBytes = await this.context.stub.getState(vanId);
        console.log(`Fetching wallet with ID : ${vanId}`);
        if (!walletBytes || walletBytes.toString().length <= 0) {
            return new Promise(() => null);
        }
        else {
            return JSON.parse(walletBytes.toLocaleString());
        }
    }
    async queryWithPagination(query, recordPerPage, bookMark) {
        console.log(`Searching wallets with query : ${query}`);
        const { iterator, metadata } = await this.context.stub.getQueryResultWithPagination(query, recordPerPage, bookMark);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                let wallet;
                try {
                    wallet = JSON.parse(res.value.value.toString());
                }
                catch (err) {
                    console.log(err);
                }
                allResults.push(wallet);
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
exports.WalletService = WalletService;
//# sourceMappingURL=WalletService.js.map