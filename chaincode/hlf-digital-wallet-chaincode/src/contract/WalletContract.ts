import { Context, Contract } from 'fabric-contract-api';
import { WalletContext } from '../context/WalletContext';
import { QueryResponse } from '../model/QueryResponse';
import { TransactionEntity } from '../model/TransactionEntity';
import { WalletEntity } from '../model/WalletEntity';

export class WalletContract extends Contract {

    public constructor() {
        // Unique name when multiple contracts per chaincode file
        super('com.tequre.blockchain.wallet');
    }

    public createContext(): Context {
        return new WalletContext();
    }

    public async init(walletContext: WalletContext) {
        console.log('Initializing wallet contract');
    }

    public async beforeTransaction(walletContext: WalletContext) {
        console.log('Parameters are ' + walletContext.stub.getStringArgs());

    }

    public async afterTransaction(walletContext: WalletContext, result: any) {
        console.log('Result is :' + result);
    }

    public async get(walletContext: WalletContext, vanId: string): Promise<string> {
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

    public async query(walletContext: WalletContext, query: string, pageSize: string, bookMark: string): Promise<string> {
        if (!query) {
            throw new Error('Query cannot be null');
        }
        if (!bookMark) {
            bookMark = '';
        }
        console.log(`Querying wallet with ${query}`);
        
        const queryResponse: QueryResponse<WalletEntity> = await walletContext.walletService.queryWithPagination(query, parseInt(pageSize, 10), bookMark);
        return JSON.stringify(queryResponse);
    }

    public async create(walletContext: WalletContext, vanId: string, balance: string, walletType: string, walletStatus: string): Promise<string> {
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
        const message: string = `Wallet created with id : ${vanId}`;
        walletContext.walletService.raiseEvent('WalletCreateEvent', Buffer.from(message));
        console.log(message);
        return JSON.stringify(wallet);
    }

    public async update(walletContext: WalletContext, vanId: string, balance: string, walletType: string, walletStatus: string): Promise<string> {
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
        const message: string = `Wallet updated with id : ${vanId}`;
        walletContext.walletService.raiseEvent('WalletUpdateEvent', Buffer.from(message));
        console.log(message);
        return JSON.stringify(wallet);
    }

    public async deposit(walletContext: WalletContext,
        vanId: string,
        amount: string

    ): Promise<string> {
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
        const wallet: WalletEntity = JSON.parse(walletBytes.toString());
        wallet.balance = wallet.balance + parseFloat(amount);
        await walletContext.stub.putState(vanId, Buffer.from(JSON.stringify(wallet)));
        const message: string = `Wallet credited with ${amount} for wallet id  : ${vanId}`;
        walletContext.walletService.raiseEvent('WalletCreditEvent', Buffer.from(message));
        return JSON.stringify(wallet);
    }

    public async withdraw(walletContext: WalletContext,
        vanId: string,
        amount: string
    ): Promise<string> {

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
        const wallet: WalletEntity = JSON.parse(walletBytes.toString());
        if (wallet.balance < parseFloat(amount)) {
            throw new Error(`Insufficient balance in wallet for id : ${vanId}. Can not proceed with withdrawal.`);
        }
        wallet.balance = wallet.balance - parseFloat(amount);
        await walletContext.stub.putState(vanId, Buffer.from(JSON.stringify(wallet)));
        const message: string = `Wallet debited with ${amount} for wallet id  : ${vanId}`;
        walletContext.walletService.raiseEvent('WalletDebitEvent', Buffer.from(message));
        return JSON.stringify(wallet);
    }

    public async transfer(
        walletContext: WalletContext,
        amount: string,
        sourceVanId: string,
        destinationVanId: string
    ): Promise<void> {

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

        let sourceWallet: WalletEntity = null;
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
        const destinationWallet: WalletEntity = JSON.parse(destinationWalletBytes.toString());

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
        const transactions: TransactionEntity[] = [];
    }
}
