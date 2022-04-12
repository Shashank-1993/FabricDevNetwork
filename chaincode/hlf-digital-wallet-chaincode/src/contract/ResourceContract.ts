import {Context, Contract} from 'fabric-contract-api';

export class ResourceContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('com.tequre.blockchain.resource');
    }

    public async init(context: Context) {
        console.log('Initializing resource contract');
    }

    public async beforeTransaction(context: Context) {
        console.log('Parameters are ' + context.stub.getStringArgs());

    }

    public async afterTransaction(context: Context, result: any) {
        console.log('Result is :' + result);
    }

    public async create(context: Context,
                        key: string,
                        value: string): Promise<string> {

        if (!key) {
            throw new Error('Resource key cannot be null');
        }
        if (!value) {
            throw new Error('Resource value cannot be null');
        }
        context.stub.putState(key, Buffer.from(value));
        return context.stub.getTxID();
    }

    public async get(context: Context,
                     key: string): Promise<string> {

        if (!key) {
            throw new Error('Resource key cannot be null');
        }
        const resourceBytes = await context.stub.getState(key);
        if (!resourceBytes || resourceBytes.toString().length <= 0) {
            return new Promise(() => null);
        } else {
            return JSON.parse(resourceBytes.toLocaleString());
        }
    }
}
