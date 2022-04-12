"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const WalletContext_1 = require("../context/WalletContext");
class WalletContract extends fabric_contract_api_1.Contract {
    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('com.tequre.blockchain.wallet');
    }
    createContext() {
        return new WalletContext_1.WalletContext();
    }
    async init(walletContext) {
        console.log('Initializing wallet contract');
    }
    async beforeTransaction(walletContext) {
        console.log('Parameters are ' + walletContext.stub.getStringArgs());
    }
    async afterTransaction(walletContext, result) {
        console.log('Result is :' + result);
    }
    async get(walletContext, vanId) {
        if (!vanId) {
            throw new Error('Wallet id cannot be null');
        }
        const walletBytes = await walletContext.stub.getState(vanId);
        if (!walletBytes || walletBytes.toString().length <= 0) {
            const result = {};
            return JSON.stringify(result);
        }
        return walletBytes.toString();
    }
    async query(walletContext, query, pageSize, bookMark) {
        if (!query) {
            throw new Error('Query cannot be null');
        }
        if (!bookMark) {
            bookMark = '';
        }
        console.log(`Querying wallet with ${query}`);
        const queryResponse = await walletContext.walletService.queryWithPagination(query, parseInt(pageSize, 10), bookMark);
        return JSON.stringify(queryResponse);
    }
    async create(walletContext, vanId, balance, walletType, walletStatus) {
        if (!balance) {
            throw new Error('Amount cannot be null');
        }
        if (parseFloat(balance) < 0.0) {
            throw new Error('Amount can not be negative');
        }
        if (!vanId) {
            throw new Error('Wallet ID cannot be null');
        }
        if (!walletType) {
            throw new Error('Wallet type cannot be null');
        }
        if (!walletStatus) {
            throw new Error('Wallet status cannot be null');
        }
        const wallet = await walletContext.walletService.create(vanId, parseFloat(balance), walletType, walletStatus);
        const message = `Wallet created with id : ${vanId}`;
        walletContext.walletService.raiseEvent('WalletCreateEvent', Buffer.from(message));
        console.log(message);
        return JSON.stringify(wallet);
    }
    async update(walletContext, vanId, balance, walletType, walletStatus) {
        if (!balance) {
            throw new Error('Amount cannot be null');
        }
        if (parseFloat(balance) < 0.0) {
            throw new Error('Amount can not be negative');
        }
        if (!vanId) {
            throw new Error('Wallet ID cannot be null');
        }
        if (!walletType) {
            throw new Error('Wallet type cannot be null');
        }
        if (!walletStatus) {
            throw new Error('Wallet status cannot be null');
        }
        const exists = await walletContext.walletService.exists(vanId);
        if (!exists) {
            throw new Error(`No wallet found for id : ${vanId}`);
        }
        const wallet = await walletContext.walletService.update(vanId, parseFloat(balance), walletType, walletStatus);
        const message = `Wallet updated with id : ${vanId}`;
        walletContext.walletService.raiseEvent('WalletUpdateEvent', Buffer.from(message));
        console.log(message);
        return JSON.stringify(wallet);
    }
    async deposit(walletContext, vanId, amount) {
        if (!amount) {
            throw new Error('Amount cannot be null');
        }
        if (parseFloat(amount) < 0.0) {
            throw new Error('Amount cannot be negative');
        }
        const walletBytes = await walletContext.stub.getState(vanId);
        if (!walletBytes || walletBytes.toString().length <= 0) {
            throw new Error(`No wallet found for id : ${vanId}`);
        }
        const wallet = JSON.parse(walletBytes.toString());
        wallet.balance = wallet.balance + parseFloat(amount);
        await walletContext.stub.putState(vanId, Buffer.from(JSON.stringify(wallet)));
        const message = `Wallet credited with ${amount} for wallet id  : ${vanId}`;
        walletContext.walletService.raiseEvent('WalletCreditEvent', Buffer.from(message));
        return JSON.stringify(wallet);
    }
    async withdraw(walletContext, vanId, amount) {
        if (!amount) {
            throw new Error('Amount cannot be null');
        }
        if (parseFloat(amount) < 0.0) {
            throw new Error('Amount cannot be negative');
        }
        if (!vanId) {
            throw new Error('Van id can not be null');
        }
        const walletBytes = await walletContext.stub.getState(vanId);
        if (!walletBytes || walletBytes.toString().length <= 0) {
            throw new Error(`No wallet found for id : ${vanId}`);
        }
        const wallet = JSON.parse(walletBytes.toString());
        if (wallet.balance < parseFloat(amount)) {
            throw new Error(`Insufficient balance in wallet for id : ${vanId}. Can not proceed with withdrawal.`);
        }
        wallet.balance = wallet.balance - parseFloat(amount);
        await walletContext.stub.putState(vanId, Buffer.from(JSON.stringify(wallet)));
        const message = `Wallet debited with ${amount} for wallet id  : ${vanId}`;
        walletContext.walletService.raiseEvent('WalletDebitEvent', Buffer.from(message));
        return JSON.stringify(wallet);
    }
    async transfer(walletContext, amount, sourceVanId, destinationVanId) {
        if (!destinationVanId) {
            throw new Error('Destination Van Id cannot be null');
        }
        if (!sourceVanId) {
            throw new Error('Source Van Id cannot be null');
        }
        if (!amount) {
            throw new Error('Amount cannot be null');
        }
        if (parseFloat(amount) < 0.0) {
            throw new Error('Amount cannot be negative');
        }
        let sourceWallet = null;
        if (sourceVanId) {
            const sourceWalletBytes = await walletContext.stub.getState(sourceVanId);
            if (!sourceWalletBytes || sourceWalletBytes.toString().length <= 0) {
                throw new Error(`Source wallet doesn't exist for id ${sourceVanId}`);
            }
            sourceWallet = JSON.parse(sourceWalletBytes.toString());
            if (sourceWallet.balance < parseFloat(amount)) {
                throw new Error(`Insufficient balance in wallet for id : ${sourceVanId}. Can not proceed with transfer.`);
            }
        }
        const destinationWalletBytes = await walletContext.stub.getState(destinationVanId);
        if (!destinationWalletBytes || destinationWalletBytes.toString().length <= 0) {
            throw new Error(`Destination wallet doesn't exist for id : ${destinationVanId}`);
        }
        const destinationWallet = JSON.parse(destinationWalletBytes.toString());
        if (sourceWallet) {
            sourceWallet.balance = sourceWallet.balance - parseFloat(amount);
        }
        destinationWallet.balance = destinationWallet.balance + parseFloat(amount);
        if (sourceWallet) {
            await walletContext.stub.putState(sourceVanId, Buffer.from(JSON.stringify(sourceWallet)));
            walletContext.walletService.raiseEvent('walletDebitEvent', Buffer.from(`Wallet debited with ${amount} for wallet id  : ${sourceWallet}`, 'utf8'));
        }
        await walletContext.stub.putState(destinationVanId, Buffer.from(JSON.stringify(destinationWallet)));
        walletContext.walletService.raiseEvent('walletCreditEvent', Buffer.from(`Wallet credited with ${amount} for wallet id  : ${destinationVanId}`, 'utf8'));
        const transactions = [];
    }
}
exports.WalletContract = WalletContract;
//# sourceMappingURL=WalletContract.js.map