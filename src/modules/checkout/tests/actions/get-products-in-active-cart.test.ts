import * as retailActions from '@msdyn365-commerce-modules/retail-actions';
import * as globalState from '@msdyn365-commerce/global-state';
import { ActiveCartProductsInput, createInput, getActiveCartProductsAction } from '../../actions/get-products-in-active-cart';

jest.mock('@msdyn365-commerce/global-state');
jest.mock('@msdyn365-commerce-modules/retail-actions');

let mockCheckoutState = {};

let mockProduct = {};

let mockProducts = {};

let mockActionContext = {};

describe('Checkout unit tests - getActiveCartProductsAction', () => {
    beforeEach(() => {
        mockCheckoutState = {
            checkoutCart: {
                cart: {
                    Id: 'cart_1',
                    CartLines: [
                        {
                            LineId: 'line_1',
                            ProductId: 'p_1'
                        },
                        {
                            LineId: 'line_2'
                        }
                    ]
                }
            }
        };

        mockProduct = {
            RecordId: 'p_1'
        };

        mockProducts = [mockProduct];

        mockActionContext = {
            telemetry: {
                exception: jest.fn()
            },
            requestContext: {
                apiSettings: {}
            }
        };

        // @ts-ignore mock partial data action
        globalState.getCheckoutState = jest.fn(() => new Promise((resolve, reject) => resolve(mockCheckoutState)));

        // @ts-ignore mock partial data action
        retailActions.getSimpleProducts = jest.fn(() => new Promise((resolve, reject) => resolve(mockProducts)));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.unmock('@msdyn365-commerce/global-state');
        jest.unmock('@msdyn365-commerce-modules/retail-actions');
    });

    it('creates input', () => {
        const input = new ActiveCartProductsInput();
        expect(input.getCacheKey()).toBe('ActiveCartProducts');
        expect(input.getCacheObjectType()).toBe('ActiveCartProducts');
        expect(input.dataCacheType()).toBe('none');
    });

    it('creates input', () => {
        const input = createInput();
        expect(input.getCacheKey()).toBe('ActiveCartProducts');
        expect(input.getCacheObjectType()).toBe('ActiveCartProducts');
        expect(input.dataCacheType()).toBe('none');
    });

    it('gets products', async () => {
        // @ts-ignore mock partial data action
        await getActiveCartProductsAction(new ActiveCartProductsInput(), mockActionContext).then(data => {
            expect(data).toMatchObject(mockProducts);
        });
    });

    it('cannot find valid cart', async () => {
        mockCheckoutState = {
            checkoutCart: {}
        };

        // @ts-ignore mock partial data action
        globalState.getCheckoutState = jest.fn(() => new Promise((resolve, reject) => resolve(mockCheckoutState)));

        // @ts-ignore mock partial data action
        await getActiveCartProductsAction(new ActiveCartProductsInput(), mockActionContext).then(data => {
            expect(data).toMatchObject([]);
        });
    });

    it('handles empty cart', async () => {
        mockCheckoutState = {
            checkoutCart: {
                cart: {
                    Id: 'cart_1',
                    CartLines: []
                }
            }
        };

        // @ts-ignore mock partial data action
        globalState.getCheckoutState = jest.fn(() => new Promise((resolve, reject) => resolve(mockCheckoutState)));

        // @ts-ignore mock partial data action
        await getActiveCartProductsAction(new ActiveCartProductsInput(), mockActionContext).then(data => {
            expect(data).toMatchObject([]);
        });
    });

    it('cannot find product', async () => {
        // @ts-ignore mock partial data action
        retailActions.getSimpleProducts = jest.fn(() => new Promise((resolve, reject) => resolve(null)));

        // @ts-ignore mock partial data action
        await getActiveCartProductsAction(new ActiveCartProductsInput(), mockActionContext).then(data => {
            expect(data).toMatchObject([]);
        });
    });

    it('throws error with invalid input', async () => {
        try {
            // @ts-ignore mock partial data action
            await getActiveCartProductsAction(null, mockActionContext);
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    it('handles error from getSimpleProducts', async () => {
        // @ts-ignore mock partial data action
        retailActions.getSimpleProducts = jest.fn(() => new Promise((resolve, reject) => reject('error')));

        try {
            // @ts-ignore mock partial data action
            await getActiveCartProductsAction(new ActiveCartProductsInput(), mockActionContext);
        } catch (e) {
            expect(e).toBeDefined();
        }
    });
});
