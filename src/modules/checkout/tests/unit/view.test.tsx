/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';
import { ICheckoutViewProps } from '../../checkout';
import { ICheckoutProps } from '../../checkout.props.autogenerated';
import ViewComponent from '../../checkout.view';

const moduleProps: ICheckoutProps<{}> = buildMockModuleProps({}, {}) as ICheckoutProps<{}>;
let mockProps: ICheckoutViewProps = {
    ...moduleProps,
    className: 'mock class',
    checkoutProps: { moduleProps, className: 'module-class-checkout' },
    headerProps: { className: 'node-class-headerProps' },
    bodyProps: { className: 'node-class-bodyProps' },
    mainProps: { className: 'node-class-mainProps' },
    mainControlProps: { className: 'node-class-mainControlProps' },
    sideProps: { className: 'node-class-sideProps' },
    sideControlFirstProps: { className: 'node-class-sideControlFirstProps' },
    sideControlSecondProps: { className: 'node-class-sideControlSecondProps' },
    title: '{title}',
    loading: '{loading}',
    alert: '{alert}',
    guidedForm: '{guidedForm}',
    orderSummary: {
        orderSummaryProps: { className: 'node-class-orderSummary' },
        heading: '{heading}',
        lines: {
            subtotal: '{subtotal}',
            totalDiscounts: '{totalDiscounts}',
            shipping: '{shipping}',
            tax: '{tax}',
            orderTotal: '{orderTotal}',
            loyalty: '{loyalty}',
            giftCard: '{giftCard}',
        }
    },
    placeOrderButton: '{placeOrderButton}',
    keepShoppingButton: '{keepShoppingButton}'
};

describe('Checkout unit tests - View', () => {
    it('renders correctly when canShow is true', () => {
        mockProps = {
            ...mockProps,
            canShow: true
        };
        const component = render(<ViewComponent {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when canShow is false', () => {
        mockProps = {
            ...mockProps,
            canShow: false
        };
        const component = render(<ViewComponent {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});