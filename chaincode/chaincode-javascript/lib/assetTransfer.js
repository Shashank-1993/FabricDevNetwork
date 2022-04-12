/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                RollNo: '001',
                Name: 'ABC',
                Physics: '81',
                Chemistry: '59',
                Maths: '75',
            },
            {
                RollNo: '002',
                Name: 'DEF',
                Physics: '64',
                Chemistry: '91',
                Maths: '78',
            },
            {
                RollNo: '003',
                Name: 'GHI',
                Physics: '54',
                Chemistry: '42',
                Maths: '63',
            },
            {
                RollNo: '004',
                Name: 'JKL',
                Physics: '46',
                Chemistry: '99',
                Maths: '87',
            },
            {
                RollNo: '005',
                Name: 'MNO',
                Physics: '98',
                Chemistry: '95',
                Maths: '93',
            },
            {
                RollNo: '006',
                Name: 'PQR',
                Physics: '85',
                Chemistry: '91',
                Maths: '78',
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.RollNo, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.RollNo} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, rollno, name, physics, chemistry, maths) {
        const averageMarks = (Number(physics)+Number(chemistry)+Number(maths))/3
        const asset = {
            RollNo: rollno,
            Name: name,
            Physics: physics,
            Chemistry: chemistry,
            Maths: maths,
            Avg: averageMarks,
        };
        ctx.stub.putState(asset.RollNo, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, rollno) {
        const assetJSON = await ctx.stub.getState(rollno); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${rollno} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, rollno, name, physics, chemistry, maths) {
        const exists = await this.AssetExists(ctx, rollno);
        if (!exists) {
            throw new Error(`The asset ${rollno} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            RollNo: rollno,
            Name: name,
            Physics: physics,
            Chemistry: chemistry,
            Maths: maths,
        };
        return ctx.stub.putState(updatedAsset.RollNo, Buffer.from(JSON.stringify(updatedAsset)));
    }

    


    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, rollno) {
        const exists = await this.AssetExists(ctx, rollno);
        if (!exists) {
            throw new Error(`The asset ${rollno} does not exist`);
        }
        return ctx.stub.deleteState(rollno);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, rollno) {
        const assetJSON = await ctx.stub.getState(rollno);
        return assetJSON && assetJSON.length > 0;
    }

   

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


}

module.exports = AssetTransfer;