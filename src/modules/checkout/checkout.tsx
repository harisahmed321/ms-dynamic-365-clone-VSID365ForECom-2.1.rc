/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/ //
import { IModuleStateProps, withModuleState } from '@msdyn365-commerce-modules/checkout-utilities';
import { Button,Heading,IModuleProps, INodeProps, Waiting } from '@msdyn365-commerce-modules/utilities';
import { AsyncResultStatus, getUrlSync } from '@msdyn365-commerce/core';
import classnames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { computed, when } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ICheckoutData } from './checkout.data';
import { ICheckoutProps } from './checkout.props.autogenerated';
import AlertComponent from './components/alert';
import { getLineItems, ILineItems } from './components/get-line-items';
import { getOrderSummary, IOrderSummary } from './components/get-order-summary';
import GuidedFormComponent from './components/guided-form';
import PlaceOrderButtonComponent from './components/place-order-button';
import placeOrder from './methods/place-order';

export * from './components/get-line-items';
export * from './components/get-order-summary';

type DeviceType = 'Mobile';

interface ICheckoutState {
    errorMessage: string;
}

export interface ICheckoutViewProps extends ICheckoutProps<{}> {
    className: string;
    canShow?: boolean;
    isEmptyCart?: boolean;
    isConsentGiven?: boolean;
    hasError?: boolean;
    cartStatus?: string;
    isMobile?: boolean;
    isEditorialMode?: boolean;
    backToShoppingUrl?: string;
    editCartLink?: string;

    checkoutProps: IModuleProps;
    headerProps: INodeProps;
    bodyProps: INodeProps;
    mainProps: INodeProps;
    mainControlProps: INodeProps;
    sideProps: INodeProps;
    sideControlFirstProps: INodeProps;
    sideControlSecondProps: INodeProps;

    guidedForm?: React.ReactNode;
    title?: React.ReactNode;
    loading?: React.ReactNode;
    alert?: React.ReactNode;
    orderSummary?: IOrderSummary;
    lineItems?: ILineItems;
    placeOrderButton?: React.ReactNode;
    keepShoppingButton?: React.ReactNode;
}

export interface ICheckoutModuleProps extends ICheckoutProps<ICheckoutData>, IModuleStateProps { }

/**
 *
 * CheckoutContainer component
 * @extends {React.Component<ICheckoutModuleProps>}
 */
// @ts-ignore
@withModuleState
@observer
class Checkout extends React.Component<ICheckoutModuleProps> {
    public state: ICheckoutState = {
        errorMessage: ''
    };

    @computed get cartStatus(): AsyncResultStatus {
        return get(this.props, 'data.checkout.status');
    }

    @computed get isEmptyCart(): boolean {
        if (this.isEditorialMode) {
            // Editorial mode: Ignore empty cart
            return false;
        }
        const cart = get(this.props, 'data.checkout.result.checkoutCart.cart');
        return this.cartStatus === 'SUCCESS' && !!cart && !isEmpty(cart) && (!cart.CartLines || cart.CartLines.length === 0);
    }

    @computed get hasError(): boolean {
        const cart = get(this.props, 'data.checkout.result.checkoutCart.cart');
        return this.cartStatus === 'FAILED' || (this.cartStatus === 'SUCCESS' && (!cart || isEmpty(cart)));
    }

    @computed get isEditorialMode(): boolean {
        return get(this.props, 'context.request.params.isEditor');
    }

    @computed get canPlaceOrder(): boolean {
        return this.props.moduleState.isReady;
    }

    public componentDidMount(): void {
        const {
            resources: { genericErrorMessage }
        } = this.props;
        // @ts-ignore: Compiler not reconizing condition check for function params
        when(
            () => this.hasError,
            () => {
                this.setState({
                    errorMessage: genericErrorMessage
                });
                this.props.context.telemetry.error('Failed to get cart');
            }
        );

        // @ts-ignore: Compiler not reconizing condition check for function params
        when(
             () => {
                 return this.isEmptyCart;
             },
             () => {
                 const editCartLink = getUrlSync('cart', this.props.context.actionContext) || '';
                 if (window && editCartLink) {
                      // Redirect to cart page if cart is empty
                      window.location.assign(editCartLink);
                  } else {
                      this.setState({
                          errorMessage: genericErrorMessage
                      });
                      this.props.context.telemetry.error('Cart is empty, but no editCartLink found');
                  }
             }
         );
    }

    // tslint:disable-next-line:max-func-body-length
    public render(): JSX.Element {
        const {
            moduleState,
            config: { className, checkoutHeading, disableGuidedCheckoutFlow },
            resources
        } = this.props;
        const { errorMessage } = this.state;
        const { backToShopping, placeOrderText, cookieConsentRequiredMessage, genericErrorMessage } = resources;
        const checkoutClass = classnames('ms-checkout', className);

        const checkoutInformation = this.getSlotItems('checkoutInformation');

        const isConsentGiven =
            this.props.context.request &&
            this.props.context.request.cookies &&
            this.props.context.request.cookies.isConsentGiven &&
            this.props.context.request.cookies.isConsentGiven();

        const isMobile =
            this.props.context.request &&
            this.props.context.request.device &&
            (this.props.context.request.device.Type as DeviceType) === 'Mobile';

        const backToShoppingUrl = getUrlSync('home', this.props.context.actionContext) || '';
        const editCartLink = getUrlSync('cart', this.props.context.actionContext) || '';

        let viewProps: ICheckoutViewProps = {
            ...this.props,
            className: checkoutClass,
            isEmptyCart: this.isEmptyCart,
            isConsentGiven,
            hasError: this.hasError,
            cartStatus: this.cartStatus,
            isMobile,
            backToShoppingUrl,
            editCartLink,
            isEditorialMode: this.isEditorialMode,

            checkoutProps: { moduleProps: this.props, className: checkoutClass },
            headerProps: { className: 'ms-checkout__head' },
            bodyProps: { className: 'ms-checkout__body' },
            mainProps: { className: 'ms-checkout__main' },
            mainControlProps: { className: 'ms-checkout__main-control' },
            sideProps: { className: 'ms-checkout__side' },
            sideControlFirstProps: { className: 'ms-checkout__side-control-first' },
            sideControlSecondProps: { className: 'ms-checkout__side-control-second' },
            title: checkoutHeading && <Heading {...checkoutHeading} className='ms-checkout__title' />
        };

        if (isConsentGiven === false) {
            viewProps = {
                ...viewProps,
                alert: <AlertComponent {...{ message: cookieConsentRequiredMessage }} />
            };
        } else if (!this.cartStatus || this.cartStatus === 'LOADING' || this.isEmptyCart) {
            viewProps = {
                ...viewProps,
                loading: <Waiting className='msc-waiting-circular msc-waiting-lg'/>
            };
        } else if (this.hasError) {
            viewProps = {
                ...viewProps,
                alert: <AlertComponent {...{ message: genericErrorMessage }} />
            };
        } else {
            viewProps = {
                ...viewProps,
                alert: errorMessage && <AlertComponent {...{ message: errorMessage }} />,
                canShow: true,
                guidedForm: checkoutInformation ? (
                    <GuidedFormComponent
                        {...{
                            items: checkoutInformation,
                            moduleState: moduleState,
                            disableGuidedCheckoutFlow: disableGuidedCheckoutFlow,
                            resource: resources,
                            isMobile: isMobile,
                            isEditor: this.isEditorialMode
                        }}
                    />
                ) : (
                        undefined
                    ),
                orderSummary: getOrderSummary(this.props),
                lineItems: getLineItems(this.props),
                placeOrderButton: (
                    <PlaceOrderButtonComponent {...{ placeOrderText, placeOrder: this.onPlaceOrder, canPlaceOrder: this.canPlaceOrder }} />
                ),
                keepShoppingButton: backToShoppingUrl && (
                    <Button
                        className='ms-checkout__btn-keep-shopping msc-btn'
                        title={backToShopping}
                        color='secondary'
                        href={backToShoppingUrl}
                    >
                    {backToShopping}
                    </Button>
                )
            };
        }

        return this.props.renderView(viewProps) as React.ReactElement;
    }

    private getSlotItems = (key: string): React.ReactNode[] | undefined => {
        const { slots } = this.props;
        return slots && slots[key] && slots[key].length ? slots[key] : undefined;
    };

    private onPlaceOrder = async (): Promise<void> => {
        const {
            resources: { genericErrorMessage },
            context: { actionContext }
        } = this.props;
        await placeOrder(actionContext).catch(error => {
            this.setState({
                errorMessage: genericErrorMessage
            });
            this.props.telemetry.exception(error);
        });
    };
}

export default Checkout;
