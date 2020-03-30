import { CheckoutState } from '@msdyn365-commerce-modules/checkout-utilities';
import { buildHydratedMockActionContext, ICoreContext } from '@msdyn365-commerce/core';
import {
    Address,
    CardTypeInfo,
    Cart,
    ChannelConfiguration,
    GiftCard,
    OrgUnitLocation,
    SalesOrder,
    SimpleProduct,
    TenderType,
    TokenizedPaymentCard
} from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { ICheckoutData } from '../checkout.data';
import { ICheckoutConfig, ICheckoutResources } from '../checkout.props.autogenerated';

const PICKUP_DELIVERY_MODE_CODE = '77';

export const actionContext = buildHydratedMockActionContext();

// @ts-ignore: we only need to mock the actionContext, ignore the rest required fields
export const mockContext: ICoreContext = {
    actionContext: actionContext,
    request: {
        // @ts-ignore mock partial data
        cookies: {
            isConsentGiven: () => true
        },
        // @ts-ignore mock partial data
        channel: {
            PickupDeliveryModeCode: PICKUP_DELIVERY_MODE_CODE
        }
    }
};

export const mockConfig: ICheckoutConfig = {
    checkoutHeading: {
        text: 'Checkout',
        // @ts-ignore
        headingTag: 'h1'
    },
    lineItemsHeading: {
        text: 'Shopping bag',
        // @ts-ignore
        headingTag: 'h2'
    },
    orderSummaryHeading: {
        text: 'Order summary',
        // @ts-ignore
        headingTag: 'h2'
    },
    // @ts-ignore
    width: 'container',
    className: 'mock-class'
};

export const mockResources: ICheckoutResources = {
    checkoutStepTitleFormat: '{stepNumber}. {stepTitle}',
    saveBtnLabel: 'Save',
    changeBtnLabel: 'Change',
    cancelBtnLabel: 'Cancel',
    saveAndContinueBtnLabel: 'Save & continue',
    genericErrorMessage: 'Something went wrong, please try again.',
    cookieConsentRequiredMessage: 'Cookie consent required to load this content. See cookie banner on the page for more details.',
    backToShopping: 'Back to shopping',
    placeOrderText: 'Place order',
    productDimensionTypeColor: 'Color',
    productDimensionTypeSize: 'Size',
    productDimensionTypeStyle: 'Style',
    discountStringText: 'Savings',
    discountOffStringText: 'off',
    itemLabel: 'item',
    itemsLabel: 'items',
    inStorePickUpLabel: 'In-store pickup ({count} {suffix})',
    shippingCountCheckoutLineItem: 'Shipping ({count} {suffix})',
    pickUpAtStoreWithLocationText: 'Pick up in a store',
    quantityDisplayString: 'Quantity',
    editCartText: 'Edit cart',
    configString: 'Configuration',
    subTotalLabel: 'Subtotal',
    shippingLabel: 'Shipping',
    freeText: 'FREE',
    taxLabel: 'Tax',
    loyaltyLabel: 'Loyalty',
    giftcardLabel: 'Gift card',
    totalAmountLabel: 'Total amount',
    totalSavingsLabel: 'Total savings',
    orderTotalLabel: 'Order total',
    totalDiscountsLabel: 'Total discounts',
    toBeCalculatedText: 'To be calculated',
    inputQuantityAriaLabel: 'quantity input'
};

// @ts-ignore: Using partial for testing
export const mockChannelConfiguration: ChannelConfiguration = {
    Currency: 'USD',
    PickupDeliveryModeCode: PICKUP_DELIVERY_MODE_CODE
};

export const mockCheckoutCart: Cart = {
    Id: 'cN6mfMjzVw7lBTQMdrwsQh~lKaU4XXbF',
    AmountDue: 100,
    TotalAmount: 100,
    CartLines: [
        {
            LineId: '574208bdcf744390adf75d460d5339bb',
            Quantity: 2,
            ProductId: 2
        }
    ],
    LoyaltyCardId: 'ABC',
    Version: 123
};

export const mockEmptyCart: Cart = {
    Id: 'cN6mfMjzVw7lBTQMdrwsQh~lKaU4XXbF',
    AmountDue: 0,
    TotalAmount: 0,
    CartLines: [],
    Version: 123
};

export const mockCheckoutCartWithShipItem: Cart = {
    Id: 'cN6mfMjzVw7lBTQMdrwsQh~lKaU4XXbF',
    AmountDue: 100,
    TotalAmount: 100,
    CartLines: [
        {
            LineId: '574208bdcf744390adf75d460d5339bb',
            DeliveryMode: '99',
            Quantity: 2,
            ShippingAddress: {
                City: 'Redmond'
            },
            ProductId: 2
        }
    ],
    Version: 123
};

export const mockCheckoutCartWithPickupItem: Cart = {
    Id: 'cN6mfMjzVw7lBTQMdrwsQh~lKaU4XXbF',
    AmountDue: 100,
    TotalAmount: 100,
    CartLines: [
        {
            LineId: '574208bdcf744390adf75d460d5339bb',
            DeliveryMode: PICKUP_DELIVERY_MODE_CODE,
            FulfillmentStoreId: 'SEATTLE',
            Quantity: 1,
            ProductId: 2
        }
    ],
    Version: 123
};

export const mockCheckoutCartWithFreeItem: Cart = {
    Id: 'cN6mfMjzVw7lBTQMdrwsQh~lKaU4XXbF',
    AmountDue: 0,
    TotalAmount: 0,
    CartLines: [
        {
            LineId: '574208bdcf744390adf75d460d5339bb',
            Quantity: 1,
            ProductId: 2
        }
    ],
    Version: 123
};

export const mockCheckoutCartWithMultiDeliveryModeItems: Cart = {
    Id: 'cN6mfMjzVw7lBTQMdrwsQh~lKaU4XXbF',
    AmountDue: 100,
    TotalAmount: 100,
    CartLines: [
        {
            LineId: '574208bdcf744390adf75d460d5339bb',
            Quantity: 1,
            DeliveryMode: '99',
            ShippingAddress: {
                City: 'Redmond'
            },
            ProductId: 2
        },
        {
            LineId: '574208bdc15413460d5339bb12313245',
            Quantity: 1,
            DeliveryMode: PICKUP_DELIVERY_MODE_CODE,
            FulfillmentStoreId: 'SEATTLE',
            ProductId: 2
        },
        {
            LineId: '574208bdcf744390adf75d460d5339bb',
            Quantity: 1,
            DeliveryMode: PICKUP_DELIVERY_MODE_CODE,
            FulfillmentStoreId: 'SEATTLE',
            ProductId: 2
        }
    ],
    Version: 123
};

export const mockProduct: SimpleProduct = {
    RecordId: 2,
    Name: 'Surface Pen Tips',
    ProductTypeValue: 0,
    BasePrice: 300,
    Price: 300,
    AdjustedPrice: 300,
    PrimaryImageUrl:
        'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/search?fileName=/Products%2F81307_000_001.png'
};

export const mockOrgUnitLocations: OrgUnitLocation[] = [
    {
        InventoryLocationId: 'SEATTLE',
        OrgUnitName: 'Seattle'
    }
];

export const mockSalesOrder: SalesOrder = {
    Id: 'cN6mfMjzVw7lBTQMdrwsQh~lKaU4XXbF',
    ChannelReferenceId: '123TESET'
};

export const mockActiveCart: Cart = {
    Id: 'gB8DCi6AK3mzMavh08C4P18wFDbEEyto',
    CartLines: [
        {
            LineId: '574208bdcf744390adf75d460d5339bb'
        }
    ],
    Version: 123
};

export const mockTokenizedPaymentCard: TokenizedPaymentCard = {
    NameOnCard: 'John'
};

export const mockShippingAddress: Address = {
    City: 'Redmond'
};

export const mockReceiptEmail: string = 'receipt@test.com';

export const mockGiftCardA: GiftCard = {
    Id: '123-456-111',
    Balance: 60
};

export const mockGiftCardB: GiftCard = {
    Id: '123-456-222',
    Balance: 50
};

export const mockGiftCardC: GiftCard = {
    Id: '123-456-333',
    Balance: 10
};

// @ts-ignore: Using partial for testing
export const mockCheckoutState: CheckoutState = {
    giftCards: [],
    cardPrefix: '4111',
    tokenizedPaymentCard: undefined,
    shippingAddress: undefined,
    billingAddress: {
        City: 'Seattle'
    },
    guestCheckoutEmail: ''
};

export const mockTenderTypes: TenderType[] = [
    {
        Function: 0,
        TenderTypeId: '1',
        Name: 'Cash',
        OperationId: 200,
        OperationName: 'Pay cash',
        ChangeTenderTypeId: '',
        AboveMinimumChangeAmount: 0,
        AboveMinimumChangeTenderTypeId: '',
        OpenDrawer: false,
        UseSignatureCaptureDevice: false,
        MinimumSignatureCaptureAmount: 0,
        IsOvertenderAllowed: false,
        IsUndertenderAllowed: true,
        MaximumOvertenderAmount: 0,
        MaximumUndertenderAmount: 0,
        MaximumAmountPerTransaction: 0,
        MaximumAmountPerLine: 0,
        MinimumAmountPerTransaction: 0,
        MinimumAmountPerLine: 0,
        RoundOff: 0,
        CountingRequired: 0,
        TakenToBank: 0,
        TakenToSafe: 0,
        ConnectorId: '',
        GiftCardItem: '',
        GiftCardCashoutOutThreshold: 0,
        ChangeLineOnReceipt: '',
        HideCardInputDetails: false,
        CashDrawerLimitEnabled: false,
        CashDrawerLimit: 0,
        RestrictReturnsWithoutReceipt: false,
        ExtensionProperties: []
    },
    {
        Function: 1,
        TenderTypeId: '3',
        Name: 'Cards',
        OperationId: 201,
        OperationName: 'Pay card',
        ChangeTenderTypeId: '',
        AboveMinimumChangeAmount: 0,
        AboveMinimumChangeTenderTypeId: '',
        OpenDrawer: false,
        UseSignatureCaptureDevice: false,
        MinimumSignatureCaptureAmount: 0,
        IsOvertenderAllowed: false,
        IsUndertenderAllowed: true,
        MaximumOvertenderAmount: 0,
        MaximumUndertenderAmount: 0,
        MaximumAmountPerTransaction: 0,
        MaximumAmountPerLine: 0,
        MinimumAmountPerTransaction: 0,
        MinimumAmountPerLine: 0,
        RoundOff: 0,
        CountingRequired: 0,
        TakenToBank: 0,
        TakenToSafe: 0,
        ConnectorId: '',
        GiftCardItem: '',
        GiftCardCashoutOutThreshold: 0,
        ChangeLineOnReceipt: '',
        HideCardInputDetails: false,
        CashDrawerLimitEnabled: false,
        CashDrawerLimit: 0,
        RestrictReturnsWithoutReceipt: false,
        ExtensionProperties: []
    },
    {
        ExtensionProperties: [],
        Function: 0,
        TenderTypeId: '8',
        Name: 'Gift Card',
        OperationId: 214,
        OperationName: 'Pay gift card',
        ChangeTenderTypeId: '',
        AboveMinimumChangeAmount: 0,
        AboveMinimumChangeTenderTypeId: '',
        OpenDrawer: false,
        UseSignatureCaptureDevice: false,
        MinimumSignatureCaptureAmount: 0,
        IsOvertenderAllowed: false,
        IsUndertenderAllowed: true,
        MaximumOvertenderAmount: 0,
        MaximumUndertenderAmount: 0,
        MaximumAmountPerTransaction: 0,
        MaximumAmountPerLine: 0,
        MinimumAmountPerTransaction: 0,
        MinimumAmountPerLine: 0,
        RoundOff: 0,
        CountingRequired: 0,
        TakenToBank: 0,
        TakenToSafe: 0,
        ConnectorId: '',
        GiftCardItem: '',
        GiftCardCashoutOutThreshold: 0,
        ChangeLineOnReceipt: '',
        HideCardInputDetails: false,
        CashDrawerLimitEnabled: false,
        CashDrawerLimit: 0,
        RestrictReturnsWithoutReceipt: false
    },
    {
        Function: 1,
        TenderTypeId: '10',
        Name: 'Loyalty Cards',
        OperationId: 207,
        OperationName: 'Pay loyalty card',
        ChangeTenderTypeId: '',
        AboveMinimumChangeAmount: 0,
        AboveMinimumChangeTenderTypeId: '',
        OpenDrawer: false,
        UseSignatureCaptureDevice: false,
        MinimumSignatureCaptureAmount: 0,
        IsOvertenderAllowed: false,
        IsUndertenderAllowed: true,
        MaximumOvertenderAmount: 0,
        MaximumUndertenderAmount: 0,
        MaximumAmountPerTransaction: 0,
        MaximumAmountPerLine: 0,
        MinimumAmountPerTransaction: 0,
        MinimumAmountPerLine: 0,
        RoundOff: 0,
        CountingRequired: 0,
        TakenToBank: 0,
        TakenToSafe: 0,
        ConnectorId: '',
        GiftCardItem: '',
        GiftCardCashoutOutThreshold: 0,
        ChangeLineOnReceipt: '',
        HideCardInputDetails: false,
        CashDrawerLimitEnabled: false,
        CashDrawerLimit: 0,
        RestrictReturnsWithoutReceipt: false,
        ExtensionProperties: []
    }
];

export const mockCardTypes: CardTypeInfo[] = [
    {
        RecordId: 5637144576,
        TypeId: 'AMEXPRESS',
        Name: 'American Express',
        PaymentMethodId: '3',
        CardTypeValue: 0,
        Issuer: 'Credit provider',
        NumberFrom: '37',
        NumberTo: '37',
        CashBackLimit: 0,
        AllowManualInput: true,
        CheckModulus: false,
        ExtensionProperties: []
    },
    {
        RecordId: 5637144577,
        TypeId: 'EUROCARD',
        Name: 'EuroCard',
        PaymentMethodId: '3',
        CardTypeValue: 0,
        Issuer: 'Credit provider',
        NumberFrom: '4511',
        NumberTo: '4512',
        CashBackLimit: 0,
        AllowManualInput: true,
        CheckModulus: false,
        ExtensionProperties: []
    },
    {
        RecordId: 5637144578,
        TypeId: 'LOYALTY',
        Name: 'Loyalty Card',
        PaymentMethodId: '10',
        CardTypeValue: 2,
        Issuer: 'US Loyalty',
        NumberFrom: '100000',
        NumberTo: '200000',
        CashBackLimit: 0,
        AllowManualInput: false,
        CheckModulus: false,
        ExtensionProperties: []
    },
    {
        RecordId: 5637144579,
        TypeId: 'MAESTRO',
        Name: 'Maestro',
        PaymentMethodId: '3',
        CardTypeValue: 1,
        Issuer: 'Debit provider',
        NumberFrom: '56',
        NumberTo: '56',
        CashBackLimit: 0,
        AllowManualInput: true,
        CheckModulus: false,
        ExtensionProperties: []
    },
    {
        RecordId: 5637144580,
        TypeId: 'MASTER',
        Name: 'Mastercard',
        PaymentMethodId: '3',
        CardTypeValue: 0,
        Issuer: 'Credit provider',
        NumberFrom: '5',
        NumberTo: '5',
        CashBackLimit: 0,
        AllowManualInput: true,
        CheckModulus: false,
        ExtensionProperties: []
    },
    {
        RecordId: 5637144584,
        TypeId: 'VISA',
        Name: 'Visa Card',
        PaymentMethodId: '3',
        CardTypeValue: 0,
        Issuer: 'Credit provider',
        NumberFrom: '4',
        NumberTo: '4',
        CashBackLimit: 0,
        AllowManualInput: true,
        CheckModulus: false,
        ExtensionProperties: []
    },
    {
        RecordId: 5637144585,
        TypeId: 'VISA',
        Name: 'Visa Card',
        PaymentMethodId: '3',
        CardTypeValue: 0,
        Issuer: 'Credit provider',
        NumberFrom: '4507',
        NumberTo: '4508',
        CashBackLimit: 0,
        AllowManualInput: true,
        CheckModulus: false,
        ExtensionProperties: []
    },
    {
        RecordId: 5637144590,
        TypeId: 'VISAELEC',
        Name: 'Visa Electron',
        PaymentMethodId: '3',
        CardTypeValue: 1,
        Issuer: 'Debit provider',
        NumberFrom: '5802',
        NumberTo: '5803',
        CashBackLimit: 0,
        AllowManualInput: true,
        CheckModulus: false,
        ExtensionProperties: []
    }
];

export const getMockData = (cart?: Cart, products?: SimpleProduct[], orgUnitLocations?: OrgUnitLocation[]): ICheckoutData => {
    return {
        // @ts-ignore: mock partial content
        checkout: {
            status: 'SUCCESS',
            // @ts-ignore: mock partial content
            result: {
                checkoutCart: {
                    cart
                }
            }
        },
        // @ts-ignore: mock partial content
        products: {
            status: 'SUCCESS',
            result: products
        },
        // @ts-ignore: mock partial content
        orgUnitLocations: {
            status: 'SUCCESS',
            result: orgUnitLocations
        }
    };
};
