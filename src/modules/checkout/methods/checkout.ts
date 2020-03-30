import { IActionContext } from '@msdyn365-commerce/core';
import { getCheckoutState } from '@msdyn365-commerce/global-state';
import { checkoutAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/CartsDataActions.g';
import { getCardTypesAsync, getTenderTypesAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/StoreOperationsDataActions.g';
import {
    Address,
    CardTypeInfo,
    CartTenderLine,
    RetailOperation,
    SalesOrder,
    TenderType,
    TokenizedPaymentCard
} from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

const OPERATIONS = {
    PayCard: 201,
    PayGiftCertificate: 214,
    PayLoyalty: 207
};

const findCreditCardType = (cardTypes: CardTypeInfo[] = [], cardPrefix: string = ''): CardTypeInfo | undefined => {
    return cardTypes.find(cardType => {
        // Check that the card type is credit card ( InternationalCreditCard (0) or CorporateCard (3))
        if (cardType.CardTypeValue !== 0 && cardType.CardTypeValue !== 3) {
            return false;
        }
        const maskNumFrom: number = parseInt(cardType.NumberFrom || '0', 10);
        const maskNumTo: number = parseInt(cardType.NumberTo || '0', 10);
        const maskLength: number = cardType.NumberFrom ? cardType.NumberFrom.length : 0;
        const cardSubStr: number =
            cardPrefix.length > maskLength ? parseInt(cardPrefix.substr(0, maskLength), 10) : parseInt(cardPrefix, 10);
        return maskNumFrom <= cardSubStr && cardSubStr <= maskNumTo;
    });
};

const findTenderIdTypeByOperationId = (tenderTypes: TenderType[], operationId: RetailOperation): string | undefined => {
    const matchedTenderType = tenderTypes.find(tenderType => tenderType.OperationId === operationId);
    if (matchedTenderType) {
        return matchedTenderType.TenderTypeId;
    }
    return;
};

const roundNumber = (value: number) => Number(value.toFixed(2));

async function getLoyaltyTenderLine(
    ctx: IActionContext,
    LoyaltyCardId: string,
    Amount: number = 0,
    Currency: string = 'USD'
): Promise<CartTenderLine> {
    const tenderTypes = await getTenderTypesAsync({ callerContext: ctx, queryResultSettings: {} }).catch(error => {
        throw error;
    });

    if (!tenderTypes) {
        throw new Error('Fail to get gift card tender line');
    }

    const TenderTypeId = findTenderIdTypeByOperationId(tenderTypes, OPERATIONS.PayLoyalty);
    return {
        // @ts-ignore
        // tslint:disable-next-line:prefer-type-cast
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
        // @ts-ignore
        // tslint:disable-next-line:prefer-type-cast
        'Amount@odata.type': '#Decimal',
        Currency,
        TenderTypeId,
        Amount,
        LoyaltyCardId
    };
}

async function getGiftCardTenderLine(
    ctx: IActionContext,
    GiftCardId: string = '',
    Amount: number = 0,
    Currency: string = 'USD'
): Promise<CartTenderLine> {
    const tenderTypes = await getTenderTypesAsync({ callerContext: ctx, queryResultSettings: {} }).catch(error => {
        throw error;
    });
    if (!tenderTypes) {
        throw new Error('Fail to get gift card tender line');
    }
    const TenderTypeId = findTenderIdTypeByOperationId(tenderTypes, OPERATIONS.PayGiftCertificate);
    return {
        // @ts-ignore
        // tslint:disable-next-line:prefer-type-cast
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
        // @ts-ignore
        // tslint:disable-next-line:prefer-type-cast
        'Amount@odata.type': '#Decimal',
        Currency,
        TenderTypeId,
        Amount,
        GiftCardId
    };
}

async function getCreditCardTenderLine(
    ctx: IActionContext,
    tokenizedPaymentCard: TokenizedPaymentCard,
    cardPrefix: string = '',
    Amount: number = 0,
    Currency: string = 'USD',
    billingAddress?: Address
): Promise<CartTenderLine> {
    const tenderTypes = await getTenderTypesAsync({ callerContext: ctx, queryResultSettings: {} }).catch(error => {
        throw error;
    });
    const cardTypes = await getCardTypesAsync({ callerContext: ctx, queryResultSettings: {} }).catch(error => {
        throw error;
    });
    if (!tenderTypes || !cardTypes) {
        throw new Error('Fail to get credit card tender line');
    }
    const cardType = findCreditCardType(cardTypes, cardPrefix);
    const cartTypeId = cardType && cardType.TypeId;
    const TenderTypeId = findTenderIdTypeByOperationId(tenderTypes, OPERATIONS.PayCard);
    const cardTenderLine: CartTenderLine = {
        // @ts-ignore
        // tslint:disable-next-line:prefer-type-cast
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CartTenderLine',
        // @ts-ignore
        // tslint:disable-next-line:prefer-type-cast
        'Amount@odata.type': '#Decimal',
        Currency,
        Amount,
        TenderTypeId,
        CardTypeId: cartTypeId
    };
    cardTenderLine.TokenizedPaymentCard = {
        ...tokenizedPaymentCard,
        CardTypeId: cartTypeId,
        // @ts-ignore
        // tslint:disable-next-line:prefer-type-cast
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.TokenizedPaymentCard',
        House: tokenizedPaymentCard.House || 'N/A',
        ...(tokenizedPaymentCard.CardTokenInfo && {
            CardTokenInfo: {
                ...tokenizedPaymentCard.CardTokenInfo,
                // @ts-ignore
                // tslint:disable-next-line:prefer-type-cast
                '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CardTokenInfo'
            }
        }),
        ...(billingAddress && {
            Phone: billingAddress.Phone,
            Country: billingAddress.ThreeLetterISORegionName,
            Address1: billingAddress.Street,
            City: billingAddress.City,
            State: billingAddress.State,
            Zip: billingAddress.ZipCode
        })
    };

    return cardTenderLine;
}

// tslint:disable-next-line:max-func-body-length
export default async (ctx: IActionContext): Promise<SalesOrder> => {
    const checkoutState = await getCheckoutState(ctx).catch(error => {
        throw error;
    });

    const cartState = checkoutState.checkoutCart;

    const channelConfiguration = ctx.requestContext.channel;

    if (!cartState || !Object.keys(cartState).length || !checkoutState || !channelConfiguration) {
        throw new Error('Fail to placeOrder');
    }

    const {
        giftCards,
        tokenizedPaymentCard,
        cardPrefix,
        guestCheckoutEmail,
        billingAddress,
        loyaltyAmount
    } = checkoutState;
    const { Currency } = channelConfiguration;

    let amountDue = cartState.cart.AmountDue || 0;
    let cartTenderLines;
    const getTenderLinePromises = [];
    const loyaltyCardNumber = cartState.cart.LoyaltyCardId;

    // Pay by loyalty first
    if (loyaltyAmount && loyaltyCardNumber) {
        const chargedAmount = roundNumber(Math.min(loyaltyAmount, amountDue));
        const loyaltyTenderLinePromise = getLoyaltyTenderLine(ctx, loyaltyCardNumber, chargedAmount, Currency);
        getTenderLinePromises.push(loyaltyTenderLinePromise);
        amountDue = roundNumber(amountDue - chargedAmount);
    }

    // Then by gift card
    if (giftCards && giftCards.length) {
        giftCards.some(giftCard => {
            if (giftCard.Balance && amountDue > 0) {
                const chargedAmount = roundNumber(Math.min(giftCard.Balance, amountDue));
                const creditCardTenderLinePromise = getGiftCardTenderLine(ctx, giftCard.Id, chargedAmount, Currency);
                getTenderLinePromises.push(creditCardTenderLinePromise);
                amountDue = roundNumber(amountDue - chargedAmount);
            }
            return amountDue === 0;
        });
    }

    // Pay the rest by credit card
    if (amountDue > 0) {
        if (!tokenizedPaymentCard) {
            throw new Error('Fail to placeOrder: no token found');
        }
        const creditCardTenderLinePromise = getCreditCardTenderLine(
            ctx,
            tokenizedPaymentCard,
            cardPrefix,
            amountDue,
            Currency,
            billingAddress
        );
        getTenderLinePromises.push(creditCardTenderLinePromise);
    }

    if (getTenderLinePromises.length > 0) {
        // When payment methods is required
        cartTenderLines = await Promise.all(getTenderLinePromises).catch(error => {
            throw error;
        });

        if (!cartTenderLines || !cartTenderLines.length) {
            throw new Error('Fail to placeOrder: fail to get cart tender lines');
        }
    }

    // Proceed checkout
    const salesOrder = await checkoutAsync(
        { callerContext: ctx, bypassCache: 'get' },
        cartState.cart.Id,
        guestCheckoutEmail,
        // @ts-ignore fields tokenizedPaymentCard and receiptNumberSequence are optional
        undefined,
        undefined,
        cartTenderLines || null,
        cartState.cart.Version
        // @ts-ignore
    ).catch(error => {
        throw error;
    });

    if (!salesOrder) {
        throw new Error('Fail to placeOrder: fail to checkout');
    }

    return salesOrder;
};
