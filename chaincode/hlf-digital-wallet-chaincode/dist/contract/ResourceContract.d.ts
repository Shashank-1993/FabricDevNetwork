import { Context, Contract } from 'fabric-contract-api';
export declare class ResourceContract extends Contract {
    constructor();
    init(context: Context): Promise<void>;
    beforeTransaction(context: Context): Promise<void>;
    afterTransaction(context: Context, result: any): Promise<void>;
    create(context: Context, key: string, value: string): Promise<string>;
    get(context: Context, key: string): Promise<string>;
}
