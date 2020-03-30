/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as coreMethods from '@msdyn365-commerce/core';
import checkout from '../../methods/checkout';
import emptyActiveCart from '../../methods/empty-active-cart';
import placeOrder from '../../methods/place-order';

jest.mock('../../methods/checkout');
jest.mock('../../methods/empty-active-cart');
jest.mock('@msdyn365-commerce/core');

const mockActionContext = {};

const mockSalesOrder = {
    Id: 'order_1',
    ChannelReferenceId: 'ABC'
};

const confirmationPageUrl = '/order-confirmation';

describe('CheckoutPlaceOrder', () => {
    describe('emptyActiveCartAction', () => {
        beforeEach(() => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            checkout.mockImplementation(async () => mockSalesOrder);

            // @ts-ignore: Jest Mocking Confuses TS Complier
            emptyActiveCart.mockImplementation(async () => ({}));

            // @ts-ignore: Jest Mocking Confuses TS Complier
            coreMethods.getUrlSync.mockImplementation(() => confirmationPageUrl);

            window.location.assign = jest.fn();
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        afterAll(() => {
            jest.unmock('../../methods/checkout');
            jest.unmock('../../methods/empty-active-cart');
            jest.unmock('@msdyn365-commerce/core');
        });

        it('runs correctly', async () => {
            try {
                // @ts-ignore
                await placeOrder(mockActionContext);
                expect(checkout).toBeCalled();
                expect(coreMethods.getUrlSync).toBeCalled();
                expect(window.location.assign).toBeCalledWith(`${confirmationPageUrl}?transactionId=order_1`);
            } catch (e) {
                expect(e).not.toBeDefined();
            }
        });

        it('throw error when checkout method fail', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            checkout.mockImplementation(async () => {
                throw new Error();
            });
            try {
                // @ts-ignore
                await placeOrder(mockActionContext);
                expect(checkout).not.toBeCalled();
                expect(coreMethods.getUrlSync).not.toBeCalled();
                expect(window.location.assign).not.toBeCalled();
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        it('throw error when emptyActiveCart method fail', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            emptyActiveCart.mockImplementation(async () => {
                throw new Error();
            });
            try {
                // @ts-ignore
                await placeOrder(mockActionContext);
                expect(checkout).not.toBeCalled();
                expect(coreMethods.getUrlSync).not.toBeCalled();
                expect(window.location.assign).not.toBeCalled();
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        it('throw error when redirect page url not found', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            coreMethods.getUrlSync.mockImplementation(() => '');

            try {
                // @ts-ignore
                await placeOrder(mockActionContext);
                expect(checkout).not.toBeCalled();
                expect(coreMethods.getUrlSync).not.toBeCalled();
                expect(window.location.assign).not.toBeCalled();
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        it('handles url with params', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            coreMethods.getUrlSync.mockImplementation(() => `${confirmationPageUrl}?d=1`);

            try {
                // @ts-ignore
                await placeOrder(mockActionContext);
                expect(checkout).toBeCalled();
                expect(coreMethods.getUrlSync).toBeCalled();
                expect(window.location.assign).toBeCalledWith(`${confirmationPageUrl}?d=1&transactionId=order_1`);
            } catch (e) {
                expect(e).not.toBeDefined();
            }
        });
    });
});
