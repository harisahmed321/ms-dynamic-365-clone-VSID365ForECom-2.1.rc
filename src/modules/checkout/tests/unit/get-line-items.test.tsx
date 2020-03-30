/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import * as eComComponents from '@msdyn365-commerce/components';
import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';
import { ICheckoutModuleProps } from '../../checkout';
import { LineItemsComponent } from '../../checkout.view';
import { getLineItems } from '../../components/get-line-items';
import {
    getMockData,
    mockCheckoutCartWithMultiDeliveryModeItems,
    mockCheckoutCartWithPickupItem,
    mockCheckoutCartWithShipItem,
    mockConfig,
    mockContext,
    mockEmptyCart,
    mockOrgUnitLocations,
    mockProduct,
    mockResources
} from '../__mock__';

jest.mock('@msdyn365-commerce/components');

describe('Checkout unit tests - getOrderSummary', () => {
    beforeEach(() => {
        // @ts-ignore: Jest Mocking Confuses TS Complier
        eComComponents.CartlineComponent.mockImplementation(() => '{LineItems}');
    });

    afterEach(() => {
        // @ts-ignore: Jest Mocking Confuses TS Complier
        eComComponents.CartlineComponent.mockReset();
    });

    afterAll(() => {
        jest.unmock('@msdyn365-commerce/components');
    });

    it('renders correctly with cart with ship item', () => {
        const mockData = getMockData(mockCheckoutCartWithShipItem, [mockProduct], mockOrgUnitLocations);
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources
        };
        const obj = getLineItems(moduleProps);
        // @ts-ignore
        const wrapper = render(<LineItemsComponent {...obj} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with cart with pick up item', () => {
        const mockData = getMockData(mockCheckoutCartWithPickupItem, [mockProduct], mockOrgUnitLocations);
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources
        };
        const obj = getLineItems(moduleProps);
        // @ts-ignore
        const wrapper = render(<LineItemsComponent {...obj} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with cart with pickup and ship item', () => {
        const mockData = getMockData(mockCheckoutCartWithMultiDeliveryModeItems, [mockProduct], mockOrgUnitLocations);
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources
        };
        const obj = getLineItems(moduleProps);
        // @ts-ignore
        const wrapper = render(<LineItemsComponent {...obj} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with empty cart', () => {
        const mockData = getMockData(mockEmptyCart, [], mockOrgUnitLocations);
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources
        };
        const obj = getLineItems(moduleProps);
        // @ts-ignore
        const wrapper = render(<LineItemsComponent {...obj} />);
        expect(wrapper).toMatchSnapshot();
    });
});
