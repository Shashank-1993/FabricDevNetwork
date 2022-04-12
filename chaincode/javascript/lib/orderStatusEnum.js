const OrderStatus = Object.freeze({
    "Settled": "-1",
    "Cancelled": "0",
    "Initiated": "1",
    "Waiting_NAV": "2",
    "Waiting_settlement": "3",
    "Unpaid": "4",
})

module.exports = OrderStatus;