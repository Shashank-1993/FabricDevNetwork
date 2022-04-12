"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContext = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const TransactionService_1 = require("../service/TransactionService");
const WalletService_1 = require("../service/WalletService");
class WalletContext extends fabric_contract_api_1.Context {
    constructor() {
        super();
        console.log('Creating instance of wallet context');
        this.walletService = new WalletService_1.WalletService(this);
        this.transactionService = new TransactionService_1.TransactionService(this);
    }
}
exports.WalletContext = WalletContext;
//# sourceMappingURL=WalletContext.js.map