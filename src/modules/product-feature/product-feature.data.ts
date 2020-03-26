/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncResult, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { SimpleProductWithAvailablility } from '../../actions/get-product-with-availability';

export interface IProductFeatureData {
    product: AsyncResult<SimpleProduct>;
    simpleProductWithAvailablility: AsyncResult<SimpleProductWithAvailablility>;
}
