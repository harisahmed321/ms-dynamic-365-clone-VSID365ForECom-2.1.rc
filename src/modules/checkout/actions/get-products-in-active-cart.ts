import { getSimpleProducts, ProductInput } from '@msdyn365-commerce-modules/retail-actions';
import { CacheType, createObservableDataAction, IAction, IActionContext, IActionInput } from '@msdyn365-commerce/core';
import { getCheckoutState } from '@msdyn365-commerce/global-state';
import { SimpleProduct } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

/**
 * Input class for activeCartWithProducts data action
 */
export class ActiveCartProductsInput implements IActionInput {
    public getCacheKey = () => 'ActiveCartProducts';
    public getCacheObjectType = () => 'ActiveCartProducts';
    public dataCacheType = (): CacheType => 'none';
}

export const createInput = () => {
    return new ActiveCartProductsInput();
};

/**
 * Calls the Retail API and returns a cart object based on the passed GetCartInput
 */
export async function getActiveCartProductsAction(input: ActiveCartProductsInput, ctx: IActionContext): Promise<SimpleProduct[]> {
    // If no cart ID is provided in input, we need to create a cart object
    if (!input) {
        ctx.telemetry.exception(new Error('[getActiveCartWithProducts]No valid Input was provided, failing'));
        throw new Error('[getActiveCartWithProducts]No valid Input was provided, failing');
    }

    const checkoutState = await getCheckoutState(ctx);
    const cart = checkoutState.checkoutCart.cart;

    // If there are cart lines, make call to get products
    if (cart && cart.CartLines && cart.CartLines.length) {
        return getSimpleProducts(
            <ProductInput[]>cart.CartLines.map(cartLine => {
                if (cartLine.ProductId) {
                    return new ProductInput(cartLine.ProductId, ctx.requestContext.apiSettings);
                }
                return undefined;
            }).filter(Boolean),
            ctx
        )
            .then(products => {
                if (products) {
                    return products;
                } else {
                    return [];
                }
            })
            .catch(error => {
                ctx.telemetry.exception(error);
                throw new Error('[getActiveCartWithProdcuts]Unable to hydrate cart with product information');
            });
    }

    return <SimpleProduct[]>[];
}

export default createObservableDataAction({
    id: '@msdyn365-commerce-modules/checkout/get-products-in-active-cart',
    action: <IAction<SimpleProduct[]>>getActiveCartProductsAction,
    input: createInput
});
