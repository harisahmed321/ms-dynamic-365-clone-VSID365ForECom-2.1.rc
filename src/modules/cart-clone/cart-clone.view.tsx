/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IOrderSummaryLines } from '@msdyn365-commerce-modules/order-summary-utilities';
import { INodeProps, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';
import { ICartViewProps } from './cart-clone';
import { ICartlinesViewProps } from './components/cart-clone-line-items';

const _renderCartlines = (
    cartLines: ICartlinesViewProps[] | undefined,
    cartEmptyText: string,
    CartlinesWrapper: INodeProps,
    storeSelector: React.ReactNode | undefined,
    backToShoppingButton: React.ReactNode,
    waitingComponent: React.ReactNode,
    cartLoadingStatus: string,
    cartDataResult: boolean
): JSX.Element[] | JSX.Element => {
    if (cartLoadingStatus) {
        return <>{cartLoadingStatus}</>;
    }
    if (cartLines) {
        return cartLines.map((cartLine, index) => {
            return (
                <div className='msc-cart-lines-item' key={index}>
                    {cartLine.cartline}
                    {storeSelector ? (
                        <Node {...cartLine.pickUpInStore.ContainerProps}>{cartLine.pickUpInStore.defaultComponent}</Node>
                    ) : null}
                    {cartLine.remove}
                    {cartLine.addToWishlist}
                    {cartLine.rating}
                </div>
            );
        });
    } else {
        return cartDataResult ? (
            <div className='msc-cart__empty-cart'>
                <p className='msc-cart-line'>{cartEmptyText}</p>
                {backToShoppingButton}
            </div>
        ) : (
            <>{waitingComponent}</>
        );
    }
};

const _renderOrderSummarylines = (
    orderSummaryLines: IOrderSummaryLines | undefined,
    OrderSummaryItems: INodeProps,
    props: ICartViewProps
): JSX.Element | null => {
    if (!orderSummaryLines) {
        return null;
    }
    return (
        <Node {...OrderSummaryItems}>
            {props.promoCode}
            {orderSummaryLines.subtotal}
            {orderSummaryLines.shipping}
            {orderSummaryLines.tax}
            {orderSummaryLines.totalDiscounts ? orderSummaryLines.totalDiscounts : null}
            {orderSummaryLines.orderTotal}
        </Node>
    );
};

const CartView: React.FC<ICartViewProps> = (props: ICartViewProps) => (
    <div className={props.className} id={props.id} {...props.renderModuleAttributes(props)}>
        {props.title}
        <Node {...props.CartlinesWrapper}>
            {_renderCartlines(
                props.cartlines,
                props.resources.emptyCartText,
                props.CartlinesWrapper,
                props.storeSelector,
                props.backToShoppingButton,
                props.waitingComponent,
                props.cartLoadingStatus,
                props.cartDataResult
            )}
        </Node>
        {props.orderSummaryHeading && (
            <Node {...props.OrderSummaryWrapper}>
                {props.orderSummaryHeading}
                {_renderOrderSummarylines(props.orderSummaryLineitems, props.OrderSummaryItems, props)}
                {props.checkoutAsSignInUserButton}
                {props.checkoutAsGuestButton}
                {props.backToShoppingButton}
            </Node>
        )}
        {props.storeSelector}
    </div>
);

export default CartView;
