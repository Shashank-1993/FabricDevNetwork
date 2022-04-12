/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {ResourceContract} from './contract/ResourceContract';
import {TransactionContract} from './contract/TransactionContract';
import {WalletContract} from './contract/WalletContract';

export {TransactionContract} from './contract/TransactionContract';
export {WalletContract} from './contract/WalletContract';
export {ResourceContract} from './contract/ResourceContract';

export const contracts: any[] = [WalletContract, TransactionContract, ResourceContract];
