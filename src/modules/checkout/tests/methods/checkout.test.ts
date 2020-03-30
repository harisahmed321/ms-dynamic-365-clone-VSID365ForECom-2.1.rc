/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buildHydratedMockActionContext, IActionContext } from '@msdyn365-commerce/core';
import * as GlobalStateActions from '@msdyn365-commerce/global-state';
import * as CartsDataActions from '@msdyn365-commerce/retail-proxy/dist/DataActions/CartsDataActions.g';
import * as OrgUnitsDataActions from '@msdyn365-commerce/retail-proxy/dist/DataActions/OrgUnitsDataActions.g';
import * as StoreOperationsDataActions from '@msdyn365-commerce/retail-proxy/dist/DataActions/StoreOperationsDataActions.g';
import placeOrderAction from '../../methods/checkout';
import {
    mockCardTypes,
    mockChannelConfiguration,
    mockCheckoutCart,
    mockCheckoutCartWithFreeItem,
    mockCheckoutState,
    mockGiftCardA,
    mockGiftCardB,
    mockGiftCardC,
    mockReceiptEmail,
    mockSalesOrder,
    mockTenderTypes,
    mockTokenizedPaymentCard
} from '../__mock__';

jest.mock('@msdyn365-commerce/global-state');
jest.mock('@msdyn365-commerce/retail-proxy/dist/DataActions/OrgUnitsDataActions.g');
jest.mock('@msdyn365-commerce/retail-proxy/dist/DataActions/StoreOperationsDataActions.g');
jest.mock('@msdyn365-commerce/retail-proxy/dist/DataActions/CartsDataActions.g');

let mockActionContext: IActionContext;
let mockCheckoutStateWithCart: GlobalStateActions.ICheckoutState;

describe('CheckoutPlaceOrder', () => {
    describe('placeOrderAction', () => {
        beforeEach(() => {
            // @ts-ignore: Using partial for testing
            mockActionContext = buildHydratedMockActionContext({});
            mockActionContext.requestContext.channel = mockChannelConfiguration;

            // @ts-ignore: Using partial for testing
            mockCheckoutStateWithCart = {
                ...mockCheckoutState,
                // @ts-ignore: Using partial for testing
                checkoutCart: {
                    cart: mockCheckoutCart,
                    updateLoyaltyCardId: jest.fn()
                }
            };

            // @ts-ignore: Jest Mocking Confuses TS Complier
            StoreOperationsDataActions.getCardTypesAsync.mockImplementation(async () => mockCardTypes);

            // @ts-ignore: Jest Mocking Confuses TS Complier
            StoreOperationsDataActions.getTenderTypesAsync.mockImplementation(async () => mockTenderTypes);

            // @ts-ignore: Jest Mocking Confuses TS Complier
            CartsDataActions.checkoutAsync.mockImplementation(async () => mockSalesOrder);
        });

        it('places order with only credit card when credit card is the only payment method', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutStateWithCart,
                    guestCheckoutEmail: mockReceiptEmail,
                    tokenizedPaymentCard: mockTokenizedPaymentCard
                })
            );

            // @ts-ignore: Using partial for testing
            const salesOrder = await placeOrderAction(mockActionContext).catch(error => {
                throw error;
            });
            expect(salesOrder).toEqual(mockSalesOrder);

            expect(CartsDataActions.checkoutAsync).toBeCalledWith(
                { callerContext: mockActionContext, bypassCache: 'get' },
                mockCheckoutCart.Id,
                mockReceiptEmail,
                undefined,
                undefined,
                [
                    {
                        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
                        'Amount@odata.type': '#Decimal',
                        Amount: 100,
                        CardTypeId: 'VISA',
                        Currency: 'USD',
                        TenderTypeId: '3',
                        TokenizedPaymentCard: {
                            '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.TokenizedPaymentCard',
                            CardTypeId: 'VISA',
                            NameOnCard: 'John',
                            Address1: undefined,
                            Country: undefined,
                            Phone: undefined,
                            State: undefined,
                            Zip: undefined,
                            House: 'N/A',
                            City: 'Seattle'
                        }
                    }
                ],
                mockCheckoutCart.Version
            );
        });

        it('places order with loyalty card', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutStateWithCart,
                    guestCheckoutEmail: mockReceiptEmail,
                    loyaltyAmount: 300,
                    tokenizedPaymentCard: null,
                    giftCards: []
                })
            );

            // @ts-ignore: Using partial for testing
            const salesOrder = await placeOrderAction(mockActionContext).catch(error => {
                throw error;
            });
            expect(salesOrder).toEqual(mockSalesOrder);

            expect(CartsDataActions.checkoutAsync).toBeCalledWith(
                { callerContext: mockActionContext, bypassCache: 'get' },
                mockCheckoutCart.Id,
                mockReceiptEmail,
                undefined,
                undefined,
                [
                    {
                        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
                        'Amount@odata.type': '#Decimal',
                        Amount: 100,
                        Currency: 'USD',
                        LoyaltyCardId: 'ABC',
                        TenderTypeId: '10'
                    }
                ],
                mockCheckoutCart.Version
            );
        });

        it('places order with gift card when gift card balance can cover the order total amount', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutStateWithCart,
                    guestCheckoutEmail: mockReceiptEmail,
                    tokenizedPaymentCard: mockTokenizedPaymentCard,
                    giftCards: [mockGiftCardA, mockGiftCardB, mockGiftCardC]
                })
            );

            // @ts-ignore: Using partial for testing
            const salesOrder = await placeOrderAction(mockActionContext).catch(error => {
                throw error;
            });
            expect(salesOrder).toEqual(mockSalesOrder);

            expect(CartsDataActions.checkoutAsync).toBeCalledWith(
                { callerContext: mockActionContext, bypassCache: 'get' },
                mockCheckoutCart.Id,
                mockReceiptEmail,
                undefined,
                undefined,
                [
                    {
                        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
                        'Amount@odata.type': '#Decimal',
                        Amount: 60,
                        Currency: 'USD',
                        GiftCardId: '123-456-111',
                        TenderTypeId: '8'
                    },
                    {
                        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
                        'Amount@odata.type': '#Decimal',
                        Amount: 40,
                        Currency: 'USD',
                        GiftCardId: '123-456-222',
                        TenderTypeId: '8'
                    }
                ],
                mockCheckoutCart.Version
            );
        });

        it('places order with gift card and credit card when gift card balbance cannot cover the order total amount', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutStateWithCart,
                    guestCheckoutEmail: mockReceiptEmail,
                    tokenizedPaymentCard: mockTokenizedPaymentCard,
                    giftCards: [mockGiftCardA]
                })
            );

            // @ts-ignore: Using partial for testing
            const salesOrder = await placeOrderAction(mockActionContext).catch(error => {
                throw error;
            });
            expect(salesOrder).toEqual(mockSalesOrder);

            expect(CartsDataActions.checkoutAsync).toBeCalledWith(
                { callerContext: mockActionContext, bypassCache: 'get' },
                mockCheckoutCart.Id,
                mockReceiptEmail,
                undefined,
                undefined,
                [
                    {
                        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
                        'Amount@odata.type': '#Decimal',
                        Amount: 60,
                        Currency: 'USD',
                        GiftCardId: '123-456-111',
                        TenderTypeId: '8'
                    },
                    {
                        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
                        'Amount@odata.type': '#Decimal',
                        Amount: 40,
                        CardTypeId: 'VISA',
                        Currency: 'USD',
                        TenderTypeId: '3',
                        TokenizedPaymentCard: {
                            '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.TokenizedPaymentCard',
                            CardTypeId: 'VISA',
                            NameOnCard: 'John',
                            House: 'N/A',
                            Address1: undefined,
                            Country: undefined,
                            Phone: undefined,
                            State: undefined,
                            Zip: undefined,
                            City: 'Seattle'
                        }
                    }
                ],
                mockCheckoutCart.Version
            );
        });

        it('place order without payment method when amount due is 0', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutState,
                    guestCheckoutEmail: mockReceiptEmail,
                    checkoutCart: {
                        cart: mockCheckoutCartWithFreeItem
                    }
                })
            );

            // @ts-ignore: Using partial for testing
            const salesOrder = await placeOrderAction(mockActionContext).catch(error => {
                throw error;
            });
            expect(salesOrder).toEqual(mockSalesOrder);

            expect(CartsDataActions.checkoutAsync).toBeCalledWith(
                { callerContext: mockActionContext, bypassCache: 'get' },
                mockCheckoutCartWithFreeItem.Id,
                mockReceiptEmail,
                undefined,
                undefined,
                null,
                mockCheckoutCartWithFreeItem.Version
            );
        });

        it('place order without payment method when amount due is 0 and payment method is provided', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutState,
                    guestCheckoutEmail: mockReceiptEmail,
                    tokenizedPaymentCard: mockTokenizedPaymentCard,
                    giftCards: [mockGiftCardA],
                    checkoutCart: {
                        cart: mockCheckoutCartWithFreeItem
                    }
                })
            );

            // @ts-ignore: Using partial for testing
            const salesOrder = await placeOrderAction(mockActionContext).catch(error => {
                throw error;
            });
            expect(salesOrder).toEqual(mockSalesOrder);

            expect(CartsDataActions.checkoutAsync).toBeCalledWith(
                { callerContext: mockActionContext, bypassCache: 'get' },
                mockCheckoutCartWithFreeItem.Id,
                mockReceiptEmail,
                undefined,
                undefined,
                null,
                mockCheckoutCartWithFreeItem.Version
            );
        });

        it('throw error when no tokenizedPaymentCard provided', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutStateWithCart,
                    tokenizedPaymentCard: null
                })
            );

            // @ts-ignore: Using partial for testing
            const salesOrder = await placeOrderAction(mockActionContext).catch(error => {
                expect(error).toBeDefined();
            });
        });

        it('throw error when no tokenizedPaymentCard provided', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutStateWithCart,
                    tokenizedPaymentCard: null
                })
            );

            // @ts-ignore: Using partial for testing
            await placeOrderAction(mockActionContext).catch(error => {
                expect(error).toBeDefined();
            });
        });

        it('throw error when checkout fail', async () => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            GlobalStateActions.getCheckoutState.mockImplementation(() =>
                Promise.resolve({
                    ...mockCheckoutStateWithCart,
                    guestCheckoutEmail: mockReceiptEmail,
                    tokenizedPaymentCard: mockTokenizedPaymentCard
                })
            );

            // @ts-ignore: Jest Mocking Confuses TS Complier
            CartsDataActions.checkoutAsync.mockImplementation(async () => {
                throw new Error();
            });

            // @ts-ignore: Using partial for testing
            await placeOrderAction(mockActionContext).catch(error => {
                expect(error).toBeDefined();
            });
        });

        afterEach(() => {
            // @ts-ignore: Jest Mocking Confuses TS Complier
            OrgUnitsDataActions.getOrgUnitConfigurationAsync.mockReset();
            // @ts-ignore: Jest Mocking Confuses TS Complier
            StoreOperationsDataActions.getCardTypesAsync.mockReset();
            // @ts-ignore: Jest Mocking Confuses TS Complier
            StoreOperationsDataActions.getTenderTypesAsync.mockReset();
            // @ts-ignore: Jest Mocking Confuses TS Complier
            CartsDataActions.checkoutAsync.mockReset();
        });

        afterAll(() => {
            jest.unmock('@msdyn365-commerce/global-state');
            jest.unmock('@msdyn365-commerce/retail-proxy/dist/DataActions/OrgUnitsDataActions.g');
            jest.unmock('@msdyn365-commerce/retail-proxy/dist/DataActions/StoreOperationsDataActions.g');
            jest.unmock('@msdyn365-commerce/retail-proxy/dist/DataActions/CartsDataActions.g');
        });
    });
});
