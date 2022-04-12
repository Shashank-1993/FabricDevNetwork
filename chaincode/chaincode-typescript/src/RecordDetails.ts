import {Object, Property} from 'fabric-contract-api';

@Object()
export class RecordDetails {
    @Property()
    public docType?: string;

    @Property()
    public ApplicationNumber: string;

    @Property()
    public Name: string;

    @Property()
    public DivisionCode: string;

    @Property()
    public DateOfEvent: string;

    @Property()
    public ActivityCode: string;

    @Property()
    public DateOfRegistration: string;

    @Property()
    public PlaceOfEvent: string;

    @Property()
    public Gender: string;

    @Property()
    public FatherName: string;

    @Property()
    public FatherLiteracy: string;

    @Property()
    public FatherOccupation: string;

    @Property()
    public FatherNationality: string;

    @Property()
    public FatherReligion: string;

    @Property()
    public MotherName: string;

    @Property()
    public MotherNationality: string;

    @Property()
    public PermanentAddress: string;

    @Property()
    public Status: string;    // Initialised orUpdated or Printed 

    @Property()
    public CreatedAt: string;

    @Property()
    public CreatedBy: string;

    @Property()
    public ModifiedAt: string;

    @Property()
    public ModifiedBy: string;

}
