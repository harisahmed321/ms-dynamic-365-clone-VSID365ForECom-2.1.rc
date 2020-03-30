/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import * as orderSummaryUtilities from '@msdyn365-commerce-modules/order-summary-utilities';
import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { ICheckoutModuleProps } from '../../checkout';
import { getOrderSummary } from '../../components/get-order-summary';
import { getMockData, mockCheckoutCart, mockConfig, mockContext, mockEmptyCart, mockResources } from '../__mock__';

jest.mock('@msdyn365-commerce-modules/order-summary-utilities');

describe('Checkout unit tests - getOrderSummary', () => {
    beforeEach(() => {
        // @ts-ignore: Jest Mocking Confuses TS Complier
        orderSummaryUtilities.OrderSummary.mockImplementation(() => '{OrderSummary}');
    });

    afterEach(() => {
        // @ts-ignore: Jest Mocking Confuses TS Complier
        orderSummaryUtilities.OrderSummary.mockReset();
    });

    afterAll(() => {
        jest.unmock('@msdyn365-commerce-modules/order-summary-utilities');
    });

    it('renders correctly with valid cart', () => {
        const mockData = getMockData(mockCheckoutCart);
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources
        };
        const obj = getOrderSummary(moduleProps);
        expect(obj).toMatchSnapshot();
        expect(obj.lines).toBeDefined();
    });

    it('renders correctly when it get an empty cart', () => {
        const mockData = getMockData(mockEmptyCart);
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources
        };
        const obj = getOrderSummary(moduleProps);
        expect(obj).toMatchSnapshot();
        expect(obj.lines).not.toBeDefined();
    });
});
