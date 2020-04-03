/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import { INodeProps } from '@msdyn365-commerce-modules/utilities';
import { Address } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

import { AddressItemType, IAddressItem } from '../address-format.data';
import AddressDetailItemComponent from './address-detail-item';

export interface IAddressShowItem {
    key: string;
    description: React.ReactNode;
}

export interface IAddressShowProps {
    AddressDetail: INodeProps;
    items: IAddressShowItem[];
}

export interface IAddressShowInputProps {
    addressFormat: IAddressItem[];
    address: Address;
}

export const AddressShow = (props: IAddressShowInputProps): IAddressShowProps => {
    const { addressFormat, address } = props;

    return {
        AddressDetail: { className: 'msc-address-detail' },
        items: addressFormat.map(item => {
            return {
                key: item.name,
                description: (
                    <AddressDetailItemComponent
                        {...{
                            isNewLine: item.isNewLine,
                            isShowLabel: item.type === AddressItemType.Phone,
                            labelText: item.label,
                            name: item.name,
                            value: address[item.name]
                        }}
                    />
                )
            };
        })
    };
};
