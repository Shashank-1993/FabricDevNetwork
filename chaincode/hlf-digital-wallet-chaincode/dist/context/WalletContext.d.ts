import { Context } from 'fabric-contract-api';
import { TransactionService } from '../service/TransactionService';
import { WalletService } from '../service/WalletService';
export declare class WalletContext extends Context {
    walletService: WalletService;
    transactionService: TransactionService;
    constructor();
}
