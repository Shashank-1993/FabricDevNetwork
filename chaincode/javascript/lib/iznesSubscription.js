'use strict';

const { Contract } = require('fabric-contract-api');
const crypto = require("crypto");
const orderStatus = require("./orderStatusEnum");

class IznesSubscription extends Contract {

    async initLedger(ctx) {
        console.info('============= chaincode again Initialised ===========');
        console.log(orderStatus.Settled)
    }

    async queryOrder(ctx, requestid) {
        const orderAsBytes = await ctx.stub.getState(requestid); // get the order from chaincode state
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`${requestid} order does not exist`);
        }
        console.log(orderAsBytes.toString());
        return orderAsBytes.toString();
    }

    async updateOrderStatus(ctx, requestid, status) {
        console.info('============= updateOrderStatus ===========');

        const orderAsBytes = await ctx.stub.getState(requestid); // get the order from chaincode state
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`${requestid} order does not exist`);
        }
        const order = JSON.parse(orderAsBytes.toString());

        order.status = orderStatus.Settled;  //hardcoded for now

        await ctx.stub.putState(requestid, Buffer.from(JSON.stringify(order)));
        console.info('============= order status updated ===========');
    }

    async createSubscriptionOrder(ctx, shareisin, portfolioid, subportfolio, dateby,
        datevalue, ordertype, orderby, ordervalue, comment, reference, sellBuyLinkOrderId) {
        console.info('============= START : Create Subscription order ===========');

        const requestid = crypto.randomBytes(16).toString("hex");

        const subscriptionOrder = {
            requestid: requestid,
            shareisin: shareisin,
            portfolioid: portfolioid,
            subportfolio: subportfolio,
            dateby: dateby,
            datevalue: datevalue,
            ordertype: ordertype,
            orderby: orderby,
            ordervalue: ordervalue,
            comment: comment,
            reference: reference,
            sellBuyLinkOrderId: sellBuyLinkOrderId,
            status: orderStatus.Initiated,
            // createdAt:"",
            // ceatedBy:"",
            // lastUpdatedAt:"",
            // lastUpdatedBy:""
        };

        await ctx.stub.putState(requestid, Buffer.from(JSON.stringify(subscriptionOrder)));
        console.info(`Subscription order persisted on ledger with requestId : ${requestid}`);

        const res = {
            data: {
                status: "OK",
                requestId: requestid,
                contractaddress: ctx.stub.getTxID()
            }
        }
        return res;
    }

    async createRedemptionOrder(ctx, SubsRequestid, shareisin, portfolioid, subportfolio, dateby,
        datevalue, ordertype, orderby, ordervalue, comment, reference, sellBuyLinkOrderId) {
        console.info('============= START : Create redemption order ===========')

        const SubsOrderAsBytes = await ctx.stub.getState(SubsRequestid); // get the order from chaincode state
        if (!SubsOrderAsBytes || SubsOrderAsBytes.length === 0) {
            throw new Error(`Subscription order with requestId : ${SubsRequestid}  does not exist, cannot proceed with redemption`);
        }

        const subsOrder = JSON.parse(SubsOrderAsBytes.toString());
        console.log(subsOrder)


        if (subsOrder.status != "-1") {
            throw new Error(`Subscription order with requestId : ${SubsRequestid} is not SETTLED, cannot proceed with redemption`);
        }

        console.log(parseInt(ordervalue) + "  dsvdsfrv " + parseInt(subsOrder.ordervalue))
        if ((parseInt(ordervalue) > parseInt(subsOrder.ordervalue))) {
            throw new Error(`Redemption order value is greater than allowed, cannot proceed with redemption`);
        }

        // update subscription order
        const updatedOrdervalue = subsOrder.ordervalue - ordervalue;
        subsOrder.ordervalue = updatedOrdervalue;
        await ctx.stub.putState(SubsRequestid, Buffer.from(JSON.stringify(subsOrder)));

        //create redemption order
        console.info('============= create redemption order ===========');

        const redemRequestid = crypto.randomBytes(16).toString("hex");

        const redemptionOrder = {
            requestid: redemRequestid,
            subsRequestid: SubsRequestid,
            shareisin: shareisin,
            portfolioid: portfolioid,
            subportfolio: subportfolio,
            dateby: dateby,
            datevalue: datevalue,
            ordertype: ordertype,
            orderby: orderby,
            ordervalue: ordervalue,
            comment: comment,
            reference: reference,
            sellBuyLinkOrderId: sellBuyLinkOrderId,
            status: orderStatus.Initiated
        };

        await ctx.stub.putState(redemRequestid, Buffer.from(JSON.stringify(redemptionOrder)));
        console.info(`Redemption order added with requestId : ${redemRequestid}`);

        const res = {
            data: {
                status: "OK",
                requestId: redemRequestid,
                contractaddress: ctx.stub.getTxID()
            }
        }
        return res;
    }

}

module.exports = IznesSubscription;
