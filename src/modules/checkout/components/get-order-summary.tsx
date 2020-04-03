/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IOrderSummaryLines, OrderSummary } from '@msdyn365-commerce-modules/order-summary-utilities';
import { Heading, INodeProps } from '@msdyn365-commerce-modules/utilities';
import get from 'lodash/get';
import * as React from 'react';
import { ICheckoutData } from '../checkout.data';
import { ICheckoutProps } from '../checkout.props.autogenerated';

export interface IOrderSummary {
    orderSummaryProps: INodeProps;
    heading?: React.ReactNode;
    lines?: IOrderSummaryLines;
}
export const getOrderSummary = (input: ICheckoutProps<ICheckoutData>): IOrderSummary => {
    const {
        config: { orderSummaryHeading },
        data: { checkout },
        resources: {
            subTotalLabel,
            shippingLabel,
            taxLabel,
            orderTotalLabel,
            loyaltyLabel,
            giftcardLabel,
            totalDiscountsLabel,
            freeText,
            toBeCalculatedText
        },
        context,
        typeName,
        id,
        telemetry
    } = input;

    const checkoutState = get(checkout, 'result');
    const cart = get(checkout, 'result.checkoutCart.cart');
    const showLineItems = cart.CartLines && cart.CartLines.length > 0;
    const channelConfiguration = context.request.channel!;

    return {
        orderSummaryProps: { className: 'ms-checkout-guest-profile__selected-item' },
        heading: orderSummaryHeading && <Heading className='msc-order-summary__heading' {...orderSummaryHeading} />,
        lines: showLineItems
            ? OrderSummary({
                  checkoutState,
                  cart,
                  subTotalLabel,
                  shippingLabel,
                  taxLabel,
                  orderTotalLabel,
                  loyaltyLabel,
                  giftcardLabel,
                  totalDiscountsLabel,
                  freeText,
                  toBeCalculatedText,
                  context,
                  typeName,
                  id,
                  channelConfiguration,
                  telemetry
              })
            : undefined
    };
};
