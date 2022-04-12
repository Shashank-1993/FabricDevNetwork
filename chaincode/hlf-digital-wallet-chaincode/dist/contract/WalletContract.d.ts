import { Context, Contract } from 'fabric-contract-api';
import { WalletContext } from '../context/WalletContext';
export declare class WalletContract extends Contract {
    constructor();
    createContext(): Context;
    init(walletContext: WalletContext): Promise<void>;
    beforeTransaction(walletContext: WalletContext): Promise<void>;
    afterTransaction(walletContext: WalletContext, result: any): Promise<void>;
    get(walletContext: WalletContext, vanId: string): Promise<string>;
    query(walletContext: WalletContext, query: string, pageSize: string, bookMark: string): Promise<string>;
    create(walletContext: WalletContext, vanId: string, balance: string, walletType: string, walletStatus: string): Promise<string>;
    update(walletContext: WalletContext, vanId: string, balance: string, walletType: string, walletStatus: string): Promise<string>;
    deposit(walletContext: WalletContext, vanId: string, amount: string): Promise<string>;
    withdraw(walletContext: WalletContext, vanId: string, amount: string): Promise<string>;
    transfer(walletContext: WalletContext, amount: string, sourceVanId: string, destinationVanId: string): Promise<void>;
}
