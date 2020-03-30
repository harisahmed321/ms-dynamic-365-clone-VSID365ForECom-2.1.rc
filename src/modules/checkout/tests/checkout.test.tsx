/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { buildMockModuleProps, ICoreContext, IRequestContext } from '@msdyn365-commerce/core';
import { ICheckoutState } from '@msdyn365-commerce/global-state';
import { AsyncResult } from '@msdyn365-commerce/retail-proxy';
import { render } from 'enzyme';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import Checkout, { ICheckoutModuleProps } from '../checkout';
import renderView from '../checkout.view';
import { actionContext, getMockData, mockCheckoutCart, mockConfig, mockContext, mockEmptyCart, mockResources } from './__mock__';

describe('Checkout', () => {
    it('renders correctly when cart is loading', () => {
        const mockData = {
            checkout: {
                status: 'LOADING'
            } as AsyncResult<ICheckoutState>
        };
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources,
            renderView
        };
        // @ts-ignore mock partial data
        const component = render(<Checkout {...moduleProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when it failed to fetch cart', () => {
        const mockData = {
            checkout: {
                status: 'FAILED'
            } as AsyncResult<ICheckoutState>
        };
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources,
            renderView
        };
        // @ts-ignore mock patial data
        const component = render(<Checkout {...moduleProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when it get an empty cart object', () => {
        const mockData = {
            checkout: {
                status: 'SUCCESS',
                result: {
                    checkoutCart: {
                        cart: {}
                    }
                }
            } as AsyncResult<ICheckoutState>
        };
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources,
            renderView
        };
        // @ts-ignore mock patial data
        const component = render(<Checkout {...moduleProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when it get an empty cart', () => {
        const mockData = getMockData(mockEmptyCart);
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources,
            renderView
        };
        // @ts-ignore mock patial data
        const component = render(<Checkout {...moduleProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when it get a valid cart', () => {
        const mockData = getMockData(mockCheckoutCart);
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, mockContext) as ICheckoutModuleProps),
            resources: mockResources,
            renderView
        };
        // @ts-ignore mock patial data
        const component = render(<Checkout {...moduleProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when consent is not given', () => {
        const mockData = getMockData(mockCheckoutCart);
        // @ts-ignore: we only need to mock the actionContext, ignore the rest required fields
        const _mockContext: ICoreContext = {
            actionContext,
            request: {
                cookies: {
                    isConsentGiven: () => false
                }
            } as IRequestContext
        };
        const moduleProps = {
            ...(buildMockModuleProps(mockData, {}, mockConfig, _mockContext) as ICheckoutModuleProps),
            resources: mockResources,
            renderView
        };
        // @ts-ignore mock patial data
        const component = render(<Checkout {...moduleProps} />);
        expect(component).toMatchSnapshot();
    });
});
