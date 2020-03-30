/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { getUrlSync, IActionContext } from '@msdyn365-commerce/core';
import checkout from './checkout';
import emptyActiveCart from './empty-active-cart';

export default async (ctx: IActionContext) => {
    let salesOrder;

    // Proceed checkout
    try {
        salesOrder = await checkout(ctx);
    } catch (error) {
        throw error;
    }

    // Remove purchased items from the active cart
    try {
        await emptyActiveCart(ctx);
    } catch (error) {
        throw error;
    }

    // Redirec to the order confirmation page
    const orderConfirmationUrl = getUrlSync('orderConfirmation', ctx) || '';
    if (!orderConfirmationUrl) {
        throw new Error('Error: No orderConfirmationUrl');
    }

    const separator = orderConfirmationUrl.includes('?') ? '&' : '?';
    const url = `${orderConfirmationUrl}${separator}transactionId=${salesOrder.Id}`;
    window.location.assign(url);
};
