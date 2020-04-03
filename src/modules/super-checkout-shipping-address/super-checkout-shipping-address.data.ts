/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ICheckoutState } from '@msdyn365-commerce/global-state';
import {
    Address, AsyncResult, CountryRegionInfo, StateProvinceInfo
} from '@msdyn365-commerce/retail-proxy';

export interface ISuperCheckoutShippingAddressData {
    checkout: AsyncResult<ICheckoutState>;
    address: AsyncResult<Address[]>;
    countryRegions: AsyncResult<CountryRegionInfo[]>;
    countryStates: AsyncResult<StateProvinceInfo[]>;
}
