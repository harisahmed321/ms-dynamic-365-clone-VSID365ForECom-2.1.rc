import { IStoreSelectorStateManager } from '@msdyn365-commerce-modules/bopis-utilities';
import { INodeProps } from '@msdyn365-commerce-modules/utilities';
import { ICartState } from '@msdyn365-commerce/global-state';
import { CartLine, OrgUnitLocation, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import * as React from 'react';

export interface IPickUpInStoreViewProps {
    callbacks: {
        toggleBopis(isBopisSelected: boolean): void;
    };
    defaultComponent?: React.ReactNode;
    orgUnitName?: string;
    isBopisSelected: boolean;
    ContainerProps: INodeProps;
}

export interface IPickUpInStoreProps {
    cartline: CartLine;
    product: SimpleProduct;
    shipitText: string;
    pickUpInStoreText: string;
    changeStoreText: string;
    cartState: ICartState | undefined;
    storeSelectorStateManager: IStoreSelectorStateManager | undefined;
    orgUnitLocations?: OrgUnitLocation[] | undefined;
}

// tslint:disable-next-line:max-func-body-length
export const PickUpInStore = (props: IPickUpInStoreProps): IPickUpInStoreViewProps => {
    const _onLocationChangedCallback = (orgUnitLocation: OrgUnitLocation, cartState: ICartState | undefined, cartline: CartLine) => {
        if(!cartState) {
            return Promise.resolve();
        }
        return cartState.updateCartLinePickupLocation({cartLineId: cartline.LineId!, location: orgUnitLocation})
            .then(result => {
                if (result.status === 'SUCCESS') {
                    // do something
                }
            })
            .catch(error => {
               return;
            });
    };

    const _toggleBOPIS = (isBopisSelected: boolean) => {
        const { storeSelectorStateManager, product, cartline, cartState } = props;

        if(isBopisSelected) {
            if(!storeSelectorStateManager) {
                return;
            }
            storeSelectorStateManager.openDialog({
                product,
                alreadySelectedLocation: {
                    InventoryLocationId: cartline.FulfillmentStoreId
                },
                onLocationSelected: (orgUnitLocation) => {
                    return _onLocationChangedCallback(orgUnitLocation, cartState, cartline);
                }
            })
            .catch(error => {
                return;
            });
        } else {
            if(!cartState) {
                return;
            }
            cartline.DeliveryMode = '';
            cartline.FulfillmentStoreId = '';
            cartline.ShippingAddress = {};
            cartState.clearCartLinePickupLocation({cartLineId: cartline.LineId!})
                .then(result => {
                    if (result.status === 'SUCCESS') {
                        // do something
                    }
                })
                .catch(error => {
                    return;
                });
        }
    };

    const _getOrgUnitName = (fulfillmentStoreId: string | undefined, orgUnitLocations: OrgUnitLocation[] | undefined) => {
        if(!orgUnitLocations || !fulfillmentStoreId || !(orgUnitLocations.length > 0)) {
            return '';
        }

        const foundLocation = orgUnitLocations.find(orgUnitLocation => {
            return orgUnitLocation.InventoryLocationId === fulfillmentStoreId;
        });

        if(foundLocation) {
            return foundLocation.OrgUnitName;
        } else {
            return fulfillmentStoreId;
        }
    };

    const _renderShippingMethod = (
        cartLine: CartLine,
        shipItText: string,
        pickupInStoretext: string,
        changeStoreText:string,
        orgUnitLocations: OrgUnitLocation[] | undefined):JSX.Element => {

        const orgUnitName = _getOrgUnitName(cartLine.FulfillmentStoreId, orgUnitLocations);
        const bopisSelected = cartLine.FulfillmentStoreId ? true : false;

        return (
                // tslint:disable:react-this-binding-issue react-a11y-role-has-required-aria-props jsx-no-lambda
                <>
                    <label className='msc-cart-line__bopis-shipping'>
                        <input
                            id={`ms-cart-bopis-ship-option-${cartLine.LineId}`}
                            type='radio'
                            name={`shippingType ${cartLine.LineId}`}
                            onChange={() => {_toggleBOPIS(false);}}
                            value={shipItText}
                            checked={!bopisSelected}
                        />
                        {shipItText}
                    </label>
                    <label className='msc-cart-line__bopis-store-pickup'>
                        <input
                            id={`ms-cart-bopis-pickup-option-${cartLine.LineId}`}
                            type='radio'
                            name={`shippingType ${cartLine.LineId}`}
                            onChange={() => {_toggleBOPIS(true);}}
                            value={pickupInStoretext}
                            checked={bopisSelected}
                        />
                        {pickupInStoretext}
                    </label>
                    {
                        cartLine.FulfillmentStoreId ? (
                            <div className='msc-cart-line__bopis__fullfilment'>
                                <span className='msc-cart-line__bopis__fullfilment-store'>{orgUnitName}</span>
                                <button className='msc-cart-line__bopis-changestore btn' onClick={() => {_toggleBOPIS(true);}}>{changeStoreText}</button>
                            </div>
                        ) : null
                    }
                </>
        );
    };

    return {
        callbacks: {
            toggleBopis: _toggleBOPIS
        },
        defaultComponent: _renderShippingMethod(props.cartline, props.shipitText, props.pickUpInStoreText, props.changeStoreText, props.orgUnitLocations),
        orgUnitName: _getOrgUnitName(props.cartline.FulfillmentStoreId, props.orgUnitLocations),
        isBopisSelected: props.cartline.FulfillmentStoreId ? true : false,
        ContainerProps: {
            className: 'msc-cart-line__bopis-container'
        }
    };
};