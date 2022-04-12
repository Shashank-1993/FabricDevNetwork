/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a asset
type SmartContract struct {
	contractapi.Contract
}

// asset describes basic details of what makes up a asset
type asset struct {
	ID                  string         `json:"id"`
	BGRequirements      BGRequirements `json:"bgRequirements"`
	BankName            string         `json:"bankName"`
	BranchName          string         `json:"branchName"`
	BankGuaranteeNumber string         `json:"bankGuaranteeNumber"`
	DateOfIssue         string         `json:"dateOfIssue"`
	ExpiryDate          string         `json:"expiryDate"`
	ClaimExpiryDate     string         `json:"claimExpiryDate"`
	GuaranteeAmount     string         `json:"guaranteeAmount"`
	ProjectDetails      ProjectDetails `json:"ProjectDetails"`
	BeneficiaryStatus   string         `json:"beneficiaryStatus"`
	EnteredBy           string         `json:"enteredBy"`
	EnteredAt           string         `json:"enteredAt"`
	ReviewedBy          string         `json:"reviewedBy"`
	ReviewedAt          string         `json:"reviewedAt"`
	BankStatus          string         `json:"bankStatus"`
	BankReviewer        string         `json:"bankReviewer"`
	BankReviewdAt       string         `json:"bankReviewdAt"`
	RecordHash          string         `json:"RecordHash"`
}

type Conditions struct {
	Description string `json:"description"`
	Required    string `json:"required"`
	Completed   string `json:"completed"`
	Satisfied   string `json:"satisfied"`
}

type ProjectDetails struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	LOA_Number  string `json:"LOA_Number"`
	VendorName  string `json:"vendorName"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
}

type BGRequirements struct {
	BankGuaranteeAmount     string `json:"bankGuaranteeAmount"`
	BankGuaranteeRequestRef string `json:"bankGuaranteeRequestRef"`
	RequiredByDate          string `json:"requiredByDate"`
	DurationYear            string `json:"durationYear"`
	DurationMonth           string `json:"durationMonth"`
	ClaimPeriod             string `json:"claimPeriod"`
	RequiredFormat          string `json:"requiredFormat"`
	Remarks                 string `json:"remarks"`
	Status                  string `json:"status"`
	CreatedAt               string `json:"createdAt"`
	CreatedBy               string `json:"createdBy"`
	StatusUpdatedAt         string `json:"statusUpdatedAt"`
	StatusUpdatedBy         string `json:"statusUpdatedBy"`
}

// QueryResult structure used for handling result of query
type QueryResult struct {
	Record *asset
}

// CreateRecord adds a new asset to the world state with given details
func (s *SmartContract) CreateRecord(ctx contractapi.TransactionContextInterface,
	id string,
	bankGuaranteeAmount string,
	bankGuaranteeRequestRef string,
	requiredByDate string,
	durationYear string,
	durationMonth string,
	claimPeriod string,
	requiredFormat string,
	remarks string,
	bgReqStatus string,
	bgReqCreatedAt string,
	bgReqCreatedBy string,
	bankName string,
	branchName string,
	bankGuaranteeNumber string,
	dateOfIssue string,
	expiryDate string,
	claimExpiryDate string,
	projectName string,
	projectDescription string,
	vendorName string,
	projectStartDate string,
	projectEndDate string,
	LOA_Number string,
	enteredBy string,
	enteredAt string,
	guaranteeAmount string,
	recordHash string) error {

	// dataJson = "[Condition{description='Signature Verification', required='yes', completed='yes', satisfied='yes'}, Condition{description='Seal Verification', required='yes', completed='no', satisfied='pending'}]"

	// var cond Conditions := json.Marshal(condi)
	// var v = json.Unmarshal(Conditions, condi)

	// var arr []string
	// _ = json.Unmarshal([]byte(dataJson), &arr)
	// log.Printf("Unmarshaled: %v", arr)

	bgRequirements := BGRequirements{
		BankGuaranteeAmount:     bankGuaranteeAmount,
		BankGuaranteeRequestRef: bankGuaranteeRequestRef,
		RequiredByDate:          requiredByDate,
		DurationYear:            durationYear,
		DurationMonth:           durationMonth,
		ClaimPeriod:             claimPeriod,
		RequiredFormat:          requiredFormat,
		Remarks:                 remarks,
		Status:                  bgReqStatus,
		CreatedAt:               bgReqCreatedAt,
		CreatedBy:               bgReqCreatedBy,
	}

	projectDetails := ProjectDetails{
		Name:        projectName,
		Description: projectDescription,
		LOA_Number:  LOA_Number,
		VendorName:  vendorName,
		StartDate:   projectStartDate,
		EndDate:     projectEndDate,
	}

	asset := asset{
		ID:                  id,
		BGRequirements:      bgRequirements,
		BankName:            bankName,
		BranchName:          branchName,
		BankGuaranteeNumber: bankGuaranteeNumber,
		DateOfIssue:         dateOfIssue,
		ExpiryDate:          expiryDate,
		ClaimExpiryDate:     claimExpiryDate,
		ProjectDetails:      projectDetails,
		BeneficiaryStatus:   "ENTERED",
		GuaranteeAmount:     guaranteeAmount,
		EnteredBy:           enteredBy,
		EnteredAt:           enteredAt,
		RecordHash:          recordHash,
		BankStatus:          "PENDING",
	}

	assetAsBytes, _ := json.Marshal(asset)

	return ctx.GetStub().PutState(id, assetAsBytes)
}

// Queryasset returns the asset stored in the world state with given id
func (s *SmartContract) QueryRecordByRegNumber(ctx contractapi.TransactionContextInterface, id string) (*asset, error) {
	assetAsBytes, err := ctx.GetStub().GetState(id)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if assetAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", id)
	}

	asset := new(asset)
	_ = json.Unmarshal(assetAsBytes, asset)

	return asset, nil
}

// QueryAllassets returns all assets found in world state
func (s *SmartContract) QueryAllRecords(ctx contractapi.TransactionContextInterface) ([]asset, error) {
	startKey := ""
	endKey := ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []asset{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		asset := new(asset)
		_ = json.Unmarshal(queryResponse.Value, asset)

		// queryResult := asset
		results = append(results, *asset)
	}

	return results, nil
}

// QueryRecordHistory returns the asset stored in the world state with given id
func (s *SmartContract) QueryRecordHistory(ctx contractapi.TransactionContextInterface, id string) (string, error) {

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return "nil", err
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the record
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return "nil", err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")

		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return buffer.String(), nil
}

// QueryAllRecordsByProject returns all assets found in world state
func (s *SmartContract) QueryAllRecordsByProject(ctx contractapi.TransactionContextInterface, projectName string) ([]asset, error) {
	startKey := ""
	endKey := ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []asset{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		asset := new(asset)
		_ = json.Unmarshal(queryResponse.Value, asset)

		// queryResult := asset
		if asset.ProjectDetails.Name == projectName {
			results = append(results, *asset)
		}

	}

	return results, nil
}

// UpdateRecordStatus updates the owner field of asset with given id in world state
func (s *SmartContract) UpdateRecordStatus(ctx contractapi.TransactionContextInterface,
	ID string,
	status string,
	updater string,
	user string,
	updatedDate string) error {
	asset, err := s.QueryRecordByRegNumber(ctx, ID)

	if err != nil {
		return err
	}

	if updater == "BANK" {
		asset.BankStatus = status
		asset.BankReviewer = user
		asset.BankReviewdAt = updatedDate
	} else if updater == "BENEFICIARY" {
		asset.BeneficiaryStatus = status
		asset.ReviewedBy = user
		asset.ReviewedAt = updatedDate
	} else if updater == "BGREQ" {
		asset.BGRequirements.Status = status
		asset.BGRequirements.StatusUpdatedBy = user
		asset.BGRequirements.StatusUpdatedAt = updatedDate
	}

	assetAsBytes, _ := json.Marshal(asset)

	return ctx.GetStub().PutState(ID, assetAsBytes)
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create BGasset chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting BGasset chaincode: %s", err.Error())
	}
}
