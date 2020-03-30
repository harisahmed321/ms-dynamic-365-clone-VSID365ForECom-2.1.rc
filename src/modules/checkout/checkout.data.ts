/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ICheckoutState } from '@msdyn365-commerce/global-state';
import { AsyncResult, OrgUnitLocation, SimpleProduct } from '@msdyn365-commerce/retail-proxy';

export interface ICheckoutData {
    checkout: AsyncResult<ICheckoutState>;
    products: AsyncResult<SimpleProduct[]>;
    orgUnitLocations: AsyncResult<OrgUnitLocation[]>;
}
