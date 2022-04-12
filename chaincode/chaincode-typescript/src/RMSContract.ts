import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import {RecordDetails} from './RecordDetails';

@Info({title: 'NDMC-RMS', description: 'Smart contract for record management'})
export class RMSContract extends Contract {

    @Transaction()
    public async Init(ctx: Context): Promise<void> {
        console.info(`RMS-Contract initialized Successfully`);
    }

    // CreateRecord issues a new record to the world state with given details.
    @Transaction()
    public async createRecord(ctx: Context, 
        applicationNumber: string, 
        name: string, 
        divisionCode: string, 
        dateOfEvent: string,
        activityCode: string, 
        dateOfRegistration: string, 
        placeOfEvent: string, 
        gender: string,
        fatherName: string, 
        fatherLiteracy: string, 
        fatherOccupation: string, 
        fatherNationality: string,
        fatherReligion: string,
        motherName: string,
        motherNationality: string, 
        permanentAddress: string, 
        createdAt: string,
        createdBy: string
        ): Promise<RecordDetails> {

            let recordType:string = "NA";

            if (activityCode == "1"){
                recordType="birth";
            }
            else if (activityCode == "5"){
                recordType="death";
            }
            else if (activityCode == "4"){
                recordType="stillbirth";
            }
        const recordEntity = {
            ApplicationNumber: applicationNumber, 
            Name: name, 
            DivisionCode: divisionCode, 
            DateOfEvent: dateOfEvent,
            ActivityCode: activityCode, 
            DateOfRegistration: dateOfRegistration, 
            PlaceOfEvent: placeOfEvent, 
            Gender: gender,
            FatherName: fatherName, 
            FatherLiteracy: fatherLiteracy, 
            FatherOccupation: fatherOccupation, 
            FatherNationality: fatherNationality,
            FatherReligion: fatherReligion,
            MotherName: motherName,
            MotherNationality: motherNationality, 
            PermanentAddress: permanentAddress, 
            Status: "INITIALISED", 
            CreatedAt: createdAt,
            CreatedBy: createdBy,
            ModifiedBy: '',
            ModifiedAt: '',
            docType: recordType ,
            downloadedBy:'',
            historyFlag:'Record Created'
        };
        await ctx.stub.putState(applicationNumber, Buffer.from(JSON.stringify(recordEntity)));
        return recordEntity;
    }

    // ModifyRecord modifies existing record with given details.
    @Transaction()
    public async modifyRecord(ctx: Context, 
        applicationNumber: string, 
        name: string, 
        divisionCode: string, 
        dateOfEvent: string,
        activityCode: string, 
        dateOfRegistration: string, 
        placeOfEvent: string, 
        gender: string,
        fatherName: string, 
        fatherLiteracy: string, 
        fatherOccupation: string, 
        fatherNationality: string,
        fatherReligion: string,
        motherName: string,
        motherNationality: string, 
        permanentAddress: string,
        modifiedBy:string,
        modifiedAt:string): Promise<string> {

            const recordState = await ctx.stub.getState(applicationNumber); // get the record from chaincode state
        if (!recordState || recordState.length === 0) {
            throw new Error(`The record ${applicationNumber} does not exist`);
        }

        let recordJSON = JSON.parse(recordState.toString());

        let recordType:string = "NA";

            if (activityCode == "1"){
                recordType="birth";
            }
            else if (activityCode == "5"){
                recordType="death";
            }
            else if (activityCode == "4"){
                recordType="stillbirth";
            }

        const record = {
            ApplicationNumber: applicationNumber, 
            Name: name, 
            DivisionCode: divisionCode, 
            DateOfEvent: dateOfEvent,
            ActivityCode: activityCode, 
            DateOfRegistration: dateOfRegistration, 
            PlaceOfEvent: placeOfEvent, 
            Gender: gender,
            FatherName: fatherName, 
            FatherLiteracy: fatherLiteracy, 
            FatherOccupation: fatherOccupation, 
            FatherNationality: fatherNationality,
            FatherReligion: fatherReligion,
            MotherName: motherName,
            MotherNationality: motherNationality, 
            PermanentAddress: permanentAddress, 
            CreatedBy:recordJSON.CreatedBy,
            CreatedAt:recordJSON.CreatedAt,
            docType:recordType,
            ModifiedAt: modifiedAt,
            ModifiedBy: modifiedBy,
            Status:'UPDATED',
            downloadedBy:recordJSON.downloadedBy,
            historyFlag:'Record Modified'
        };
        await ctx.stub.putState(applicationNumber, Buffer.from(JSON.stringify(record)));

        return 'Record Modified Successfully';
    }

    // Approve record 
    @Transaction(true)
    public async approveRecord(ctx: Context,applicationNumber: string,docHash: string): Promise<string>{
        const recordState = await ctx.stub.getState(applicationNumber); // get the record from chaincode state
        const recordJSON = JSON.parse(recordState.toString());
        if (!recordState || recordState.length === 0) {
            throw new Error(`The record ${applicationNumber} does not exist`);
        }
        else{
            recordJSON.Status = 'APPROVED';
            recordJSON.DocHash = docHash;
            await ctx.stub.putState(applicationNumber, Buffer.from(JSON.stringify(recordJSON)));
        }
        return 'Approved Successfully, Ready to Print';
    }

    // queryRecordByRegNumber returns the record stored in the world state with given registrationNumber.
    @Transaction(false)
    public async queryRecordByRegNumber(ctx: Context, 
        applicationNumber: string): Promise<string> {

        const recordState = await ctx.stub.getState(applicationNumber); // get the record from chaincode state
        if (!recordState || recordState.length === 0) {
            throw new Error(`The record ${applicationNumber} does not exist`);
        }

        const strValue = Buffer.from(recordState).toString('utf8');
        let recordInJsonArrayForm = `[${strValue}]`;

        let recordJSON = JSON.parse(recordInJsonArrayForm);

        console.log(recordJSON);
        return recordJSON;

    }

    @Transaction(false)
    public async queryAllRecords(ctx: Context): Promise<string> {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            allResults.push(JSON.parse(strValue));
        }
        console.info(allResults);        
        return JSON.stringify(allResults);
    }


    // GetRecordHistory returns the record history stored ledger with given registrationNumber.
    @Transaction(false)
    public async getRecordHistory(ctx: Context, applicationNumber: string): Promise<string> {
        const recordJSON = await ctx.stub.getHistoryForKey(applicationNumber); // get the record from chaincode state
        if (!recordJSON) {
            throw new Error(`The record ${applicationNumber} does not exist`);
        }

        const promiseOfIterator = ctx.stub.getHistoryForKey(applicationNumber);

        const results = [];
        for await (const keyMod of promiseOfIterator) {
            const resp = {
                timestamp: keyMod.timestamp,
                txid: keyMod.txId,
                data: ''
            }
            if (keyMod.isDelete) {
                resp.data = 'KEY DELETED';
            } else {
                resp.data = JSON.parse(keyMod.value.toString());
            }
            results.push(JSON.parse(JSON.stringify(resp)));
        }

        console.log(results)
        return JSON.stringify(results);
    }

 
     @Transaction(true)
     public async downloadFlag(ctx: Context,applicationNumber: string,downloadedBy: string): Promise<string>{
         const recordState = await ctx.stub.getState(applicationNumber); // get the record from chaincode state
         const recordJSON = JSON.parse(recordState.toString());
         if (!recordState || recordState.length === 0) {
             throw new Error(`The record ${applicationNumber} does not exist`);
         }
         else{
             
             recordJSON.downloadedBy = downloadedBy;
             await ctx.stub.putState(applicationNumber, Buffer.from(JSON.stringify(recordJSON)));
         }
         return `DownloadedBy ${downloadedBy} `;
     }

     @Transaction(true)
     public async historyFlagUpdate(ctx: Context,applicationNumber: string,historyFlag: string): Promise<string>{
         const recordState = await ctx.stub.getState(applicationNumber); // get the record from chaincode state
         const recordJSON = JSON.parse(recordState.toString());
         if (!recordState || recordState.length === 0) {
             throw new Error(`The record ${applicationNumber} does not exist`);
         }
         else{
             
             recordJSON.historyFlag = historyFlag;
             await ctx.stub.putState(applicationNumber, Buffer.from(JSON.stringify(recordJSON)));
         }
         return `History Flag ${historyFlag} `;
     }

}
