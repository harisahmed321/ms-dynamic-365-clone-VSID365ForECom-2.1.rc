/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import classname from 'classnames';
import * as React from 'react';

import { Heading as HeadingData } from '@msdyn365-commerce-modules/data-types';
import { Heading, INodeProps } from '@msdyn365-commerce-modules/utilities';
import { Address } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

import { AddressFormat } from '../address-format';
import { IAddressResource, IAddressResponse } from '../address-module.data';
import AddressButtonComponent from './address-button';
import AddressErrorMessageComponent from './address-error-message';
import AddressErrorTitleComponent from './address-error-title';
import { AddressShow, IAddressShowProps } from './address-show';

export interface IAddressListError {
    Error: INodeProps;
    isShowError: boolean;
    title: React.ReactNode;
    message: React.ReactNode;
}

export interface IAddressListItem {
    Item: INodeProps;
    key: number;
    error: IAddressListError;
    showItems: IAddressShowProps;
    isShowPrimaryButton: boolean;
    primaryButton: React.ReactNode;
    editButton: React.ReactNode;
}

export interface IAddressList {
    List: INodeProps;
    isShowList: boolean;
    heading: React.ReactNode;
    items: IAddressListItem[];
}

export interface IAddressListProps {
    ListAddress: INodeProps;
    heading: React.ReactNode;
    isShowEmptyListMessage: boolean;
    emptyListMessage: React.ReactNode;
    addButton: React.ReactNode;
    primaryAddressList: IAddressList;
    otherAddressList: IAddressList;
}

export interface IAddressListInputProps {
    isUpdating?: boolean;
    selectedAddress?: Address;
    addressFormat: AddressFormat;
    addresses: Address[];
    heading?: HeadingData;
    primaryAddressSectionHeading?: HeadingData;
    otherAddressSectionHeading?: HeadingData;
    addressActionResponse?: IAddressResponse;
    resources: IAddressResource;
    onAddAddress(): void;
    onEditAddress(address?: Address): void;
    onUpdatePrimaryAddress(address: Address): void;
}

const getButtonAriaLabel = (ariaLabel: string, addressName?: string): string => {
    return ariaLabel.replace('{addressName}', addressName || '');
};

const getAddressList = (
    className: string,
    addresses: Address[],
    showPrimaryButton: boolean,
    props: IAddressListInputProps,
    heading?: HeadingData
): IAddressList => {
    const { resources, isUpdating, addressActionResponse, selectedAddress, addressFormat, onEditAddress, onUpdatePrimaryAddress } = props;
    const { errorTitle = null, errorMessage = null } = addressActionResponse || {};

    return {
        List: { className: className },
        isShowList: addresses.length > 0,
        heading: heading && <Heading className={`${className}-heading`} {...heading} />,
        items: addresses.map(
            (address: Address): IAddressListItem => {
                const isSelectedAddress = selectedAddress && selectedAddress.RecordId === address.RecordId;
                const isShowError = isSelectedAddress && errorTitle && errorMessage;
                return {
                    Item: { className: `${className}-list` },
                    key: address.RecordId || 0,
                    showItems: AddressShow({
                        addressFormat: addressFormat.getAddressFormat(address.ThreeLetterISORegionName || ''),
                        address: address
                    }),
                    error: {
                        Error: { className: `${className}-error` },
                        isShowError: isShowError ? true : false,
                        title: <AddressErrorTitleComponent {...{ title: errorTitle || '' }} />,
                        message: <AddressErrorMessageComponent {...{ message: errorMessage || '' }} />
                    },
                    isShowPrimaryButton: showPrimaryButton,

                    primaryButton: (
                        <AddressButtonComponent
                            {...{
                                className: classname('msc-address-list__button-primary msc-btn', {
                                    'msc-address-list__button-updating': isUpdating && isSelectedAddress
                                }),
                                disabled: isUpdating,
                                text: resources.addressPrimaryButtonText,
                                ariaLabel: getButtonAriaLabel(resources.addressPrimaryButtonAriaLabel, address.Name),
                                onClick: () => {
                                    onUpdatePrimaryAddress(address);
                                }
                            }}
                        />
                    ),
                    editButton: (
                        <AddressButtonComponent
                            {...{
                                className: 'msc-address-list__button-edit',
                                disabled: isUpdating,
                                text: resources.addressEditButtonText,
                                ariaLabel: getButtonAriaLabel(resources.addressEditButtonAriaLabel, address.Name),
                                onClick: () => {
                                    onEditAddress(address);
                                }
                            }}
                        />
                    )
                };
            }
        )
    };
};

const getPrimaryAddressList = (props: IAddressListInputProps): IAddressList => {
    const { addresses, primaryAddressSectionHeading } = props;
    const primaryAddresses = addresses.filter((address: Address) => address.IsPrimary);
    return getAddressList('msc-address-list__primary', primaryAddresses, false, props, primaryAddressSectionHeading);
};

const getOtherAddressList = (props: IAddressListInputProps): IAddressList => {
    const { addresses, otherAddressSectionHeading } = props;
    const otherAddresses = addresses.filter((address: Address) => !address.IsPrimary);
    return getAddressList('msc-address-list__primary', otherAddresses, true, props, otherAddressSectionHeading);
};

export const AddressList = (props: IAddressListInputProps): IAddressListProps => {
    const { addresses, heading, resources, onAddAddress } = props;

    return {
        ListAddress: { className: 'ms-address-list' },
        heading: heading && <Heading className='msc-address-list__heading' {...heading} />,
        isShowEmptyListMessage: addresses.length === 0,
        emptyListMessage: <p className='msc-address-list__add-empty'>{resources.addressEmptyListAddressMessage}</p>,
        addButton: (
            <AddressButtonComponent
                {...{
                    className: 'msc-address-list__button-add msc-btn',
                    text: resources.addressAddButtonText,
                    ariaLabel: resources.addressAddButtonAriaLabel,
                    onClick: onAddAddress
                }}
            />
        ),
        primaryAddressList: getPrimaryAddressList(props),
        otherAddressList: getOtherAddressList(props)
    };
};
