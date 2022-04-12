"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
class ResourceContract extends fabric_contract_api_1.Contract {
    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('com.tequre.blockchain.resource');
    }
    async init(context) {
        console.log('Initializing resource contract');
    }
    async beforeTransaction(context) {
        console.log('Parameters are ' + context.stub.getStringArgs());
    }
    async afterTransaction(context, result) {
        console.log('Result is :' + result);
    }
    async create(context, key, value) {
        if (!key) {
            throw new Error('Resource key cannot be null');
        }
        if (!value) {
            throw new Error('Resource value cannot be null');
        }
        context.stub.putState(key, Buffer.from(value));
        return context.stub.getTxID();
    }
    async get(context, key) {
        if (!key) {
            throw new Error('Resource key cannot be null');
        }
        const resourceBytes = await context.stub.getState(key);
        if (!resourceBytes || resourceBytes.toString().length <= 0) {
            return new Promise(() => null);
        }
        else {
            return JSON.parse(resourceBytes.toLocaleString());
        }
    }
}
exports.ResourceContract = ResourceContract;
//# sourceMappingURL=ResourceContract.js.map