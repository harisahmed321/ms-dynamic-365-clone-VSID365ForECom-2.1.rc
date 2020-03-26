/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStoreSelectorStateManager } from '@msdyn365-commerce-modules/bopis-utilities';
import { getProductUrlSync } from '@msdyn365-commerce-modules/retail-actions';
import { Button } from '@msdyn365-commerce-modules/utilities';
import {
    AddToWishlistComponent,
    CartlineComponent,
    ICartlineResourceString,
    IWishlistActionSuccessResult,
    RatingComponent
} from '@msdyn365-commerce/components';
import { ICoreContext, IGridSettings, IImageSettings, ITelemetry } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { CartLine, CommerceList, OrgUnitLocation, ProductAvailableQuantity, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import * as React from 'react';
import { IPickUpInStoreViewProps, PickUpInStore } from './cart-clone-pick-up-in-store';

export interface ICartLineItemsProps {
    cartlines: CartLine[];
    cartState: ICartState | undefined;
    orgUnitLocations: OrgUnitLocation[] | undefined;
    resources: ICartlineResourceString;
    productAvailabilites: ProductAvailableQuantity[] | undefined;
    products: SimpleProduct[] | undefined;
    /** GridSettings for the product image in cartline  */
    gridSettings: IGridSettings;
    /** ImageSettings for the product image in cartline  */
    imageSettings: IImageSettings;
    id: string;
    typeName: string;
    context: ICoreContext;
    telemetry: ITelemetry;
    removeButtonText: string;
    addToWishlistButtonText: string;
    removeFromWishlistButtonText: string;
    shipItText: string;
    pickitUpText: string;
    changeStoreText: string;
    storeSelectorStateManager: IStoreSelectorStateManager | undefined;
    outOfStockThreshold: number;
    isStockCheckEnabled: boolean;
    wishlists: CommerceList[] | undefined;
    defaultWishlistName: string;
    maxCartlineQuantity: number;
    avgRating: number;
    removeItemClickHandler(cartlineToRemove: CartLine): void;
    moveToWishlistSuccessHandler(result: IWishlistActionSuccessResult, cartlineId: CartLine): void;
    updateCartLinesQuantitySuccessHandler(cartline: CartLine, quantity: number): void;
}

export interface ICartlinesViewProps {
    cartline: React.ReactNode;
    pickUpInStore: IPickUpInStoreViewProps;
    remove: React.ReactNode;
    addToWishlist: React.ReactNode | undefined;
    rating: React.ReactNode;
}

const _getProduct = (productId: number | undefined, products: SimpleProduct[]): SimpleProduct | undefined => {
    if (productId !== undefined && products) {
        return products.find(product => {
            return productId === product.RecordId;
        });
    }
    return undefined;
};

const _getCartItemMaxQuantity = (
    outOfStockThreshold: number,
    maxCartlineQuantity: number,
    isStockCheckEnabled: boolean,
    productAvailability?: ProductAvailableQuantity
) => {
    if (isStockCheckEnabled) {
        if (
            !productAvailability ||
            productAvailability.AvailableQuantity ||
            productAvailability.AvailableQuantity! <= 0 ||
            productAvailability.AvailableQuantity! <= outOfStockThreshold
        ) {
            return 0;
        }
        return productAvailability.AvailableQuantity! - outOfStockThreshold;
    }

    return maxCartlineQuantity;
};

// tslint:disable-next-line: max-func-body-length
const _assembleNode = (
    cartline: CartLine,
    product: SimpleProduct,
    props: ICartLineItemsProps,
    index: number,
    foundProductAvailability?: ProductAvailableQuantity
): ICartlinesViewProps => {
    const {
        imageSettings,
        gridSettings,
        id,
        typeName,
        context,
        resources,
        removeButtonText,
        removeItemClickHandler,
        moveToWishlistSuccessHandler,
        addToWishlistButtonText,
        removeFromWishlistButtonText,
        wishlists,
        defaultWishlistName,
        avgRating
    } = props;
    const isAuthenticated = context.request.user.isAuthenticated;
    const nameOfWishlist = wishlists && wishlists.length > 0 && wishlists[0].Name ? wishlists[0].Name : defaultWishlistName;
    const maxQuantity = _getCartItemMaxQuantity(
        props.outOfStockThreshold,
        props.maxCartlineQuantity,
        props.isStockCheckEnabled,
        foundProductAvailability
    );

    const onRemoveClickHandler = (event: React.MouseEvent<HTMLElement>) => {
        removeItemClickHandler(cartline);
    };

    return {
        cartline: (
            <CartlineComponent
                data={{
                    cartLine: cartline,
                    product: product
                }}
                currentQuantity={cartline.Quantity!}
                maxQuantity={maxQuantity}
                isOutOfStock={props.isStockCheckEnabled ? (maxQuantity <= 0 ? true : false) : false}
                gridSettings={gridSettings}
                imageSettings={imageSettings}
                id={id}
                typeName={typeName}
                productUrl={getProductUrlSync(product, props.context.actionContext, undefined)}
                context={context}
                resources={resources}
                key={index}
                isQuantityEditable={true}
                quantityOnChange={props.updateCartLinesQuantitySuccessHandler}
                primaryImageUrl={product.PrimaryImageUrl}
            />
        ),
        pickUpInStore: PickUpInStore({
            cartState: props.cartState,
            cartline: cartline,
            product: product,
            shipitText: props.shipItText,
            pickUpInStoreText: props.pickitUpText,
            changeStoreText: props.changeStoreText,
            storeSelectorStateManager: props.storeSelectorStateManager,
            orgUnitLocations: props.orgUnitLocations
        }),
        remove: (
            <Button className='msc-cart-line__remove-item' onClick={onRemoveClickHandler} title={removeButtonText}>
                {removeButtonText}
            </Button>
        ),
        addToWishlist: isAuthenticated ? (
            <AddToWishlistComponent
                className={'msc-cart-line__add-to-wishlist'}
                addToWishlistButtonText={addToWishlistButtonText}
                removeFromWishlistButtonText={removeFromWishlistButtonText}
                context={context}
                id={id}
                key={cartline.LineId!}
                typeName={typeName}
                nameOfWishlist={nameOfWishlist}
                cartline={cartline}
                showButtonText={true}
                showStatusMessage={false}
                showRemoveButton={false}
                showButtonTooltip={false}
                data={{
                    wishlists: wishlists,
                    product: product
                }}
                onSuccess={moveToWishlistSuccessHandler}
            />
        ) : (
            undefined
        ),
        rating: (
            <RatingComponent
                context={context}
                id={id}
                typeName={typeName}
                avgRating={avgRating}
                ratingCount={'50'}
                readOnly={true}
                ariaLabel={''}
                data={{}}
            />
        )
    };
};

const _assembleCartlines = (
    cartlines: CartLine[],
    products: SimpleProduct[] | undefined,
    props: ICartLineItemsProps
): ICartlinesViewProps[] | null => {
    const reactNodes: ICartlinesViewProps[] = [];

    if (!products || products.length === 0) {
        return null;
    }

    cartlines.map((cartline, index) => {
        const product = _getProduct(cartline.ProductId, products);
        let foundProductAvailability;
        if (props.productAvailabilites && props.productAvailabilites.length > 0) {
            foundProductAvailability = props.productAvailabilites.find(productAvailability => {
                return productAvailability.ProductId! === cartline.ProductId;
            });
        }
        if (product) {
            reactNodes.push(_assembleNode(cartline, product, props, index, foundProductAvailability));
        }
    });

    return reactNodes;
};

/**
 * CartLineItems component
 */

export const CartLineItems = (props: ICartLineItemsProps) => {
    const { products, cartlines } = props;
    return _assembleCartlines(cartlines, products, props);
};
