/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import { Module, Node } from '@msdyn365-commerce-modules/utilities';

import { IAddressAddItem, IAddressAddUpdateProps } from './common/components/address-add';
import { IAddressSelectItem, IAddressSelectProps } from './common/components/address-select';
import { IAddressShowItem, IAddressShowProps } from './common/components/address-show';
import { ICheckoutShippingAddressViewProps } from './super-checkout-shipping-address';

const AddressShow: React.FC<IAddressShowProps> = ({ AddressDetail, items }) => {
    return (
        <Node {...AddressDetail}>
            {items &&
                items.map((item: IAddressShowItem) => {
                    return <>{item.description}</>;
                })}
        </Node>
    );
};

const AddressSelect: React.FC<IAddressSelectProps> = ({
    SelectAddress,
    addButton,
    items,
    isShowSaveButton,
    saveButton,
    isShowCancelButton,
    cancelButton
}) => {
    return (
        <Node {...SelectAddress}>
            {addButton}
            {items &&
                items.map((item: IAddressSelectItem) => {
                    const SelectItem = item.SelectItem;
                    return (
                        <Node {...SelectItem} key={item.key}>
                            {item.input}
                            <AddressShow {...item.showItems} />
                        </Node>
                    );
                })}
            {isShowSaveButton && saveButton}
            {isShowCancelButton && cancelButton}
        </Node>
    );
};

const AddressAddUpdate: React.FC<IAddressAddUpdateProps> = ({
    AddressForm,
    heading,
    items,
    hasError,
    error,
    isShowSaveButton,
    saveButton,
    isShowCancelButton,
    cancelButton
}) => {
    return (
        <Node {...AddressForm}>
            {heading}
            {items &&
                items.map((item: IAddressAddItem) => {
                    const { AddressItem, key, label, alert, input } = item;
                    return (
                        <Node {...AddressItem} key={key}>
                            {label}
                            {alert}
                            {input}
                        </Node>
                    );
                })}
            {hasError && (
                <Node {...error.AddressError}>
                    {error.title}
                    {error.message}
                </Node>
            )}
            {isShowSaveButton && saveButton}
            {isShowCancelButton && cancelButton}
        </Node>
    );
};

const CheckoutShippingAddressView: React.FC<ICheckoutShippingAddressViewProps> = props => {
    const { CheckoutShippingAddress, viewState, showAddress, showAddressSelect, showAddOrUpdateAddress } = props;

    return (
        <Module {...CheckoutShippingAddress}>
            {viewState.isShowAddress && <AddressShow {...showAddress} />}
            {viewState.isShowAddresList && <AddressSelect {...showAddressSelect} />}
            {viewState.isShowAddOrUpdateAddress && <AddressAddUpdate {...showAddOrUpdateAddress} />}
        </Module>
    );
};

export default CheckoutShippingAddressView;
