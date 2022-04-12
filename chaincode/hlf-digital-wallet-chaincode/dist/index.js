"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.contracts = exports.ResourceContract = exports.WalletContract = exports.TransactionContract = void 0;
const ResourceContract_1 = require("./contract/ResourceContract");
const TransactionContract_1 = require("./contract/TransactionContract");
const WalletContract_1 = require("./contract/WalletContract");
var TransactionContract_2 = require("./contract/TransactionContract");
Object.defineProperty(exports, "TransactionContract", { enumerable: true, get: function () { return TransactionContract_2.TransactionContract; } });
var WalletContract_2 = require("./contract/WalletContract");
Object.defineProperty(exports, "WalletContract", { enumerable: true, get: function () { return WalletContract_2.WalletContract; } });
var ResourceContract_2 = require("./contract/ResourceContract");
Object.defineProperty(exports, "ResourceContract", { enumerable: true, get: function () { return ResourceContract_2.ResourceContract; } });
exports.contracts = [WalletContract_1.WalletContract, TransactionContract_1.TransactionContract, ResourceContract_1.ResourceContract];
//# sourceMappingURL=index.js.map