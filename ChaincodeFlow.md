Create Subscription Response

{
  "data": {
    "status": "OK",
    "requestId": "b9d56f4ed91817ac7501028dab21dc03",
    "contractaddress": "e1b56a26fa22e8fa57b5a8a843631b590db96abe57b04825e5865813b34d7ac6"
  }
}


Subscription Order on BLC

{
  "comment": "",
  "dateby": "cutoff",
  "datevalue": "2022-04-0600: 00",
  "orderby": "q",
  "ordertype": "s",
  "ordervalue": "500000",
  "portfolioid": "27",
  "reference": "",
  "requestid": "b9d56f4ed91817ac7501028dab21dc03",
  "sellBuyLinkOrderId": "null",
  "shareisin": "FR4009705616",
  "status": 1,
  "subportfolio": "AEMZN557M8ywWmgI3SWr5oHLnbyyG_8vyw"
}



tried creating redemption order on "Initiated" subscription order

Error: endorsement failure during invoke. response: status:500 message:"error in simulation: transaction returned with failure: Error: Subscription order with requestId : b9d56f4ed91817ac7501028dab21dc03 is not SETTLED, cannot proceed with redemption"


Updated order status to SETTLED

{
  "dateby": "cutoff",
  "datevalue": "2022-04-06 00:00",
  "orderby": "q",
  "ordertype": "s",
  "ordervalue": "500000",
  "portfolioid": "27",
  "requestid": "b9d56f4ed91817ac7501028dab21dc03",
  "sellBuyLinkOrderId": "null",
  "shareisin": "FR4009705616",
  "subportfolio": "AEMZN557M8ywWmgI3SWr5oHLnbyyG_8vyw",
  "comment": "",
  "status": "-1",
  "reference": ""
}

tried creating redemption order for amount greater than subscription amount

Error: endorsement failure during invoke. response: status:500 message:"error in simulation: transaction returned with failure: Error: Redemption order value is greater than allowed, cannot proceed with redemption"


Tried redemption order with amount 300000

{
  "data": {
    "status": "OK",
    "requestId": "dc21bcc9c00d147cdb2f49275ea5b98b",
    "contractaddress": "809a25b9f1ad68e320b62f9101469e417f11b2e3ce9fa16a517ad0928b00be0a"
  }
}


query subscription order

{
  "dateby": "cutoff",
  "datevalue": "2022-04-06 00:00",
  "orderby": "q",
  "ordertype": "s",
  "ordervalue": 200000,
  "portfolioid": "27",
  "requestid": "b9d56f4ed91817ac7501028dab21dc03",
  "sellBuyLinkOrderId": "null",
  "shareisin": "FR4009705616",
  "subportfolio": "AEMZN557M8ywWmgI3SWr5oHLnbyyG_8vyw",
  "comment": "",
  "status": "-1",
  "reference": ""
}


query redemption order

{
  "comment": "",
  "dateby": "cutoff",
  "datevalue": "2022-04-06 00:00",
  "orderby": "q",
  "ordertype": "r",
  "ordervalue": "300000",
  "portfolioid": "27",
  "reference": "",
  "requestid": "dc21bcc9c00d147cdb2f49275ea5b98b",
  "sellBuyLinkOrderId": "null",
  "shareisin": "FR4009705616",
  "status": "1",
  "subportfolio": "AEMZN557M8ywWmgI3SWr5oHLnbyyG_8vyw",
  "subsRequestid": "b9d56f4ed91817ac7501028dab21dc03"
}

