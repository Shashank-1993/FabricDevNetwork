import {Context} from 'fabric-contract-api';
import {TransactionService} from '../service/TransactionService';
import {WalletService} from '../service/WalletService';

export class WalletContext extends Context {

    public walletService: WalletService;
    public transactionService: TransactionService;

    constructor() {
        super();
        console.log('Creating instance of wallet context');
        this.walletService = new WalletService(this);
        this.transactionService = new TransactionService(this);
    }
}
