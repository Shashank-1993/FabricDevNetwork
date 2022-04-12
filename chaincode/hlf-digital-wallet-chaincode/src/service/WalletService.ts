import {Context} from 'fabric-contract-api';
import {QueryResponse} from '../model/QueryResponse';
import {WalletEntity} from '../model/WalletEntity';

export class WalletService {
    private readonly context: Context;

    constructor(context: Context) {
        this.context = context;
        console.log('Initializing wallet service');
    }

    public async create(vanId: string, balance: number, walletType: string, walletStatus: string): Promise<WalletEntity> {
        const wallet: WalletEntity = {
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

    public async update(vanId: string, balance: number, walletType: string, walletStatus: string): Promise<WalletEntity> {
        const walletBytes = await this.context.stub.getState(vanId);
        const wallet: WalletEntity = JSON.parse(walletBytes.toLocaleString());
        wallet.balance = balance;
        wallet.walletStatus = walletStatus;
        wallet.walletType = walletType;
        console.log(`Updating wallet with ID : ${vanId}`);
        await this.context.stub.putState(vanId, Buffer.from(JSON.stringify(wallet)));
        return wallet;
    }

    public raiseEvent(eventName: string, payload: Buffer) {
        this.context.stub.setEvent(eventName, payload);
    }

    public async delete(vanId: string) {
        await this.context.stub.deleteState(vanId);
    }


    public async exists(vanId: string): Promise<boolean> {
        const walletBytes = await this.context.stub.getState(vanId);
        return walletBytes && walletBytes.toLocaleString().length > 0;
    }

    public async get(vanId: string): Promise<WalletEntity> {
        const walletBytes = await this.context.stub.getState(vanId);
        console.log(`Fetching wallet with ID : ${vanId}`);
        if (!walletBytes || walletBytes.toString().length <= 0) {
            return new Promise(() => null);
        } else {
            return JSON.parse(walletBytes.toLocaleString());
        }
    }

    public async queryWithPagination(query: string, recordPerPage: number, bookMark: string): Promise<QueryResponse<WalletEntity>> {
        console.log(`Searching wallets with query : ${query}`);
        const {iterator, metadata} = await this.context.stub.getQueryResultWithPagination(query, recordPerPage, bookMark);
        const allResults: WalletEntity[] = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                let wallet: WalletEntity;
                try {
                    wallet = JSON.parse(res.value.value.toString());
                } catch (err) {
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
