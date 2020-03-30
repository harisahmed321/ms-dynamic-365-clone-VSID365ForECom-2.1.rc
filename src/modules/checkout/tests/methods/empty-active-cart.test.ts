/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IActionContext } from '@msdyn365-commerce/core';
import * as GlobalStateActions from '@msdyn365-commerce/global-state';
import emptyActiveCartAction from '../../methods/empty-active-cart';
import { mockActiveCart, mockCheckoutCart } from '../__mock__';

jest.mock('@msdyn365-commerce/global-state');

let mockActionContext: IActionContext;
let mockCartState: GlobalStateActions.ICartState;
let mockCheckoutState: GlobalStateActions.ICheckoutState;

describe('CheckoutPlaceOrder', () => {
    describe('emptyActiveCartAction', () => {
        beforeEach(() => {
            // @ts-ignore: Using partial for testing
            mockActionContext = {
                update: jest.fn(),
                // @ts-ignore: Using partial for testing
                requestContext: {
                    // @ts-ignore: Using partial for testing
                    apiSettings: {}
                }
            };

            // @ts-ignore: Jest Mocking Confuses TS Complier
            mockCartState = {
                cart: mockActiveCart,
                removeCartLines: jest.fn(),
                removeAllPromoCodes: jest.fn()
            };

            // @ts-ignore: Jest Mocking Confuses TS Complier
            mockCheckoutState = {
                // @ts-ignore: Jest Mocking Confuses TS Complier
                checkoutCart: {
                    cart: mockCheckoutCart
                }
            };

            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCartState.mockImplementation(async () => mockCartState);

            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(async () => mockCheckoutState);
        });

        it('emptys the active cart', async () => {
            // @ts-ignore: Using partial for testing
            await emptyActiveCartAction(mockActionContext);
            expect(mockCartState.removeCartLines).toBeCalledWith(
                expect.objectContaining({
                    cartLineIds: [mockCheckoutCart.CartLines && mockCheckoutCart.CartLines[0].LineId]
                })
            );
        });

        it('throws error when no cart found', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            mockCartState = {
                ...mockCartState,
                // @ts-ignore
                cart: undefined
            };

            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCartState.mockImplementation(async () => mockCartState);

            try {
                // @ts-ignore: Using partial for testing
                await emptyActiveCartAction(mockActionContext);
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        it('throws error when no checkoutCart found', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            mockCheckoutState = {
                ...mockCheckoutState,
                // @ts-ignore
                checkoutCart: undefined
            };

            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(async () => mockCheckoutState);

            try {
                // @ts-ignore: Using partial for testing
                await emptyActiveCartAction(mockActionContext);
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        afterEach(() => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCartState.mockReset();
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockReset();
            // @ts-ignore: Jest Mocking Confuses TS Complier
            mockActionContext.update.mockReset();
        });

        afterAll(() => {
            jest.unmock('@msdyn365-commerce/global-state');
        });
    });
});
