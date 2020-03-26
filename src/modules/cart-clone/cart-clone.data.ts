/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStoreSelectorStateManager } from '@msdyn365-commerce-modules/bopis-utilities';
import { FullProduct } from '@msdyn365-commerce/commerce-entities';
import { ICartState } from '@msdyn365-commerce/global-state';
import { AsyncResult, CommerceList, OrgUnitLocation, ProductAvailableQuantity, SimpleProduct } from '@msdyn365-commerce/retail-proxy';

export interface ICartCloneData {
    storeSelectorStateManager: AsyncResult<IStoreSelectorStateManager>;
    cart: AsyncResult<ICartState>;
    products: AsyncResult<SimpleProduct[]>;
    orgUnitLocations: AsyncResult<OrgUnitLocation[]>;
    productAvailabilites: AsyncResult<ProductAvailableQuantity[]>;
    wishlists: AsyncResult<CommerceList[]>;
    wishlistItems: AsyncResult<FullProduct[]>;
}
