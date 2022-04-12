import { Context } from 'fabric-contract-api';
import { TransactionService } from '../service/TransactionService';
import { WalletService } from '../service/WalletService';
export declare class TransactionContext extends Context {
    walletService: WalletService;
    transactionService: TransactionService;
    constructor();
}
