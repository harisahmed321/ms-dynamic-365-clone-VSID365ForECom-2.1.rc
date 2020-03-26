import { CartLineItems, ICartLineItemsProps } from '../components/cart-clone-line-items';

describe('Cart line items component', () => {

    it('renders correctly when all the data is provided', () => {
        // @ts-ignore partial mock
        const componentProps: ICartLineItemsProps = {
            cartlines:[
                {
                    ItemId: '10',
                    LineId: '10',
                    ProductId: 10
                },
                {
                    ItemId: '20',
                    LineId: '20',
                    ProductId: 20
                }
            ],
            // @ts-ignore partial mock
            products: [
                {
                    RecordId: 10,
                },
                {
                    RecordId: 20
                }
            ],
            resources: {
                sizeString: 'Size',
                colorString: 'Color',
                configString: 'Config',
                styleString: 'Style',
                quantityDisplayString: 'Quantity',
                inputQuantityAriaLabel: 'aria label for quantity',
                discountStringText: 'Savings'
            },
            productAvailabilites: [
                {
                    ProductId: 10,
                    AvailableQuantity: 15,
                },
                {
                    ProductId: 20,
                    AvailableQuantity: 5
                }
            ],
            isStockCheckEnabled: true,
            outOfStockThreshold: 2,
            maxCartlineQuantity: 20,
            context: {
                request:{
                    // @ts-ignore partial mock
                    user: {
                        isAuthenticated: false
                    }
                }
            }
        };

        const cartLineItems =  CartLineItems(componentProps);
        expect(cartLineItems).not.toBeNull();
        expect(cartLineItems![0].cartline).not.toBeNull();
        expect(cartLineItems![0].remove).not.toBeNull();
    });
    it('renders correctly without stock check', () => {
        // @ts-ignore partial mock
        const componentProps: ICartLineItemsProps = {
            cartlines:[
                {
                    ItemId: '10',
                    LineId: '10',
                    ProductId: 10
                },
                {
                    ItemId: '20',
                    LineId: '20',
                    ProductId: 20
                }
            ],
            // @ts-ignore partial mock
            products: [
                {
                    RecordId: 10,
                },
                {
                    RecordId: 20
                }
            ],
            resources: {
                sizeString: 'Size',
                colorString: 'Color',
                configString: 'Config',
                styleString: 'Style',
                quantityDisplayString: 'Quantity',
                inputQuantityAriaLabel: 'aria label for quantity',
                discountStringText: 'Savings'
            },
            isStockCheckEnabled: true,
            outOfStockThreshold: 2,
            maxCartlineQuantity: 20,
            context: {
                request:{
                    // @ts-ignore partial mock
                    user: {
                        isAuthenticated: false
                    }
                }
            }
        };

        const cartLineItems =  CartLineItems(componentProps);
        expect(cartLineItems).not.toBeNull();
        expect(cartLineItems![0].cartline).not.toBeNull();
        expect(cartLineItems![0].remove).not.toBeNull();
    });
});