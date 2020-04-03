/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import { INodeProps } from '@msdyn365-commerce-modules/utilities';
import { Address } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

import { AddressFormat } from '../address-format';
import { IAddressResource } from '../address-module.data';
import AddressButtonComponent from './address-button';
import AddressInputComponent from './address-input';
import { AddressShow, IAddressShowProps } from './address-show';

export interface IAddressSelectInputProps {
    hasExternalSubmitGroup?: boolean;
    addressFormat: AddressFormat;
    addresses: Address[];
    resources: IAddressResource;
    selectedAddress: Address;
    onAddressOptionChange(event: React.ChangeEvent<HTMLInputElement>): void;
    onAddAddress(): void;
    onSave(): void;
    onCancel(): void;
}

export interface IAddressSelectItem {
    key: number;
    SelectItem: INodeProps;
    input: React.ReactNode;
    showItems: IAddressShowProps;
}

export interface IAddressSelectProps {
    SelectAddress: INodeProps;
    addButton: React.ReactNode;
    items: IAddressSelectItem[];
    isShowSaveButton: boolean;
    saveButton: React.ReactNode;
    isShowCancelButton: boolean;
    cancelButton: React.ReactNode;
}

const getInput = (index: number, address: Address, props: IAddressSelectInputProps): React.ReactNode => {
    const { addresses, onAddressOptionChange, selectedAddress } = props;

    const ichecked = address.RecordId === selectedAddress.RecordId;
    const additionalAttributes = {
        checked: ichecked,
        'aria-checked': ichecked,
        'aria-setsize': addresses.length,
        'aria-posinset': index + 1
    };

    return (
        <AddressInputComponent
            {...{
                className: 'msc-address-select',
                name: 'selectAddressOptions',
                type: 'radio',
                value: (address.RecordId || '').toString(),
                onChange: onAddressOptionChange,
                additionalAddributes: additionalAttributes
            }}
        />
    );
};

const getAddressSelectItems = (props: IAddressSelectInputProps): IAddressSelectItem[] => {
    const { addresses, addressFormat } = props;

    return addresses.map((address, index) => {
        return {
            key: address.RecordId || 0,
            SelectItem: { className: 'msc-address-select__item' },
            input: getInput(index, address, props),
            showItems: AddressShow({
                addressFormat: addressFormat.getAddressFormat(address.ThreeLetterISORegionName || ''),
                address: address
            })
        };
    });
};

export const AddressSelect = (props: IAddressSelectInputProps): IAddressSelectProps => {
    const { resources, onCancel, onSave, onAddAddress, hasExternalSubmitGroup } = props;

    return {
        SelectAddress: { className: 'msc-address-select' },
        addButton: (
            <AddressButtonComponent
                {...{
                    className: 'msc-address-select__button-add',
                    text: resources.addressAddButtonText,
                    ariaLabel: resources.addressAddButtonAriaLabel,
                    onClick: onAddAddress
                }}
            />
        ),
        isShowSaveButton: !hasExternalSubmitGroup,
        saveButton: (
            <AddressButtonComponent
                {...{
                    className: 'msc-address-select__button-save',
                    text: resources.addressSaveButtonText,
                    ariaLabel: resources.addressSaveButtonAriaLabel,
                    onClick: onSave
                }}
            />
        ),
        isShowCancelButton: !hasExternalSubmitGroup,
        cancelButton: (
            <AddressButtonComponent
                {...{
                    className: 'msc-address-select__button-cancel',
                    text: resources.addressCancelButtonText,
                    ariaLabel: resources.addressCancelButtonAriaLabel,
                    onClick: onCancel
                }}
            />
        ),
        items: getAddressSelectItems(props)
    };
};
