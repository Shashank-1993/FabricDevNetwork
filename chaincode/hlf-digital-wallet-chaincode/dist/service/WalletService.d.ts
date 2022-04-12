/// <reference types="node" />
import { Context } from 'fabric-contract-api';
import { QueryResponse } from '../model/QueryResponse';
import { WalletEntity } from '../model/WalletEntity';
export declare class WalletService {
    private readonly context;
    constructor(context: Context);
    create(vanId: string, balance: number, walletType: string, walletStatus: string): Promise<WalletEntity>;
    update(vanId: string, balance: number, walletType: string, walletStatus: string): Promise<WalletEntity>;
    raiseEvent(eventName: string, payload: Buffer): void;
    delete(vanId: string): Promise<void>;
    exists(vanId: string): Promise<boolean>;
    get(vanId: string): Promise<WalletEntity>;
    queryWithPagination(query: string, recordPerPage: number, bookMark: string): Promise<QueryResponse<WalletEntity>>;
}
