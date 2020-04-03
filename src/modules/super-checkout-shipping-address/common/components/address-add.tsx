/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import classname from 'classnames';
import { get } from 'mobx';
import * as React from 'react';

import { Heading as HeadingData } from '@msdyn365-commerce-modules/data-types';
import { Heading, INodeProps } from '@msdyn365-commerce-modules/utilities';
import { Address } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

import { AddressType, IAddressResource, IAddressResponse } from '../address-module.data';
import {
    AddressItemDisplayType,
    AddressItemType,
    AddressValidationRuleType,
    IAddressDropdownsData,
    IAddressItem,
    IAddressValidationRule
} from '../address-format.data';
import AddressAlertComponent from './address-alert';
import AddressButtonComponent from './address-button';
import AdressDropdownComponent from './address-dropdown';
import AddressErrorMessageComponent from './address-error-message';
import AddressErrorTitleComponent from './address-error-title';
import AddressInputComponent from './address-input';
import AddressLabelComponent from './address-label';

export interface IAddressAddInputProps {
    isUpdating?: boolean;
    hasError?: boolean;
    hasExternalSubmitGroup?: boolean;
    addressType: AddressType;
    addressFormat: IAddressItem[];
    defaultCountryRegionId: string;
    selectedAddress?: Address;
    dropdownDisplayData: IAddressDropdownsData;
    resources: IAddressResource;
    addressActionResponse?: IAddressResponse;
    addAddressHeading?: HeadingData;
    editAddressHeading?: HeadingData;
    validationError?: object;
    onInputChange(event: React.ChangeEvent<HTMLInputElement>): void;
    onDropdownChange(event: React.ChangeEvent<HTMLSelectElement>): void;
    onSave(): void;
    onCancel(): void;
}

export interface IAddressError {
    AddressError: INodeProps;
    title: React.ReactNode;
    message: React.ReactNode;
}

export interface IAddressAddItem {
    key: string;
    AddressItem: INodeProps;
    label: React.ReactNode;
    alert: React.ReactNode;
    input: React.ReactNode;
}

export interface IAddressAddUpdateProps {
    AddressForm: INodeProps;
    heading: React.ReactNode;
    items: IAddressAddItem[];
    hasError: boolean;
    error: IAddressError;
    isShowSaveButton: boolean;
    saveButton: React.ReactNode;
    isShowCancelButton: boolean;
    cancelButton: React.ReactNode;
}

const getRequriedAttribute = (validationRules?: IAddressValidationRule[]): object => {
    const requriedRule = (validationRules || []).find(validationRule => {
        return validationRule.type === AddressValidationRuleType.Required;
    });

    return requriedRule ? { 'aria-required': true } : {};
};

const getAddessItems = (selectedAddress: Address, props: IAddressAddInputProps): IAddressAddItem[] => {
    const {
        addressFormat,
        addressType,
        dropdownDisplayData,
        defaultCountryRegionId,
        validationError = {},
        onInputChange,
        onDropdownChange
    } = props;

    // @ts-ignore
    return addressFormat.map(addressFormatItem => {
        const elementId = `${addressType.toLowerCase()}_address${addressFormatItem.name.toLowerCase()}`;
        const errorMessage = get(validationError, addressFormatItem.name);
        const className = classname('msc-address-form__item', `msc-address-form__item-${addressFormatItem.name.toLowerCase()}`, {
            'msc-address-form__item-newline': addressFormatItem.isNewLine,
            'address-form__item-invalid': errorMessage
        });
        let input;

        if (addressFormatItem.displayType === AddressItemDisplayType.Input) {
            input = (
                <AddressInputComponent
                    {...{
                        id: elementId,
                        name: addressFormatItem.name,
                        className: 'msc-address-form',
                        type: 'text',
                        value: selectedAddress[addressFormatItem.name],
                        maxLength: addressFormatItem.maxLength,
                        onChange: onInputChange,
                        additionalAddributes: getRequriedAttribute(addressFormatItem.validationRules)
                    }}
                />
            );
        } else {
            const displayData = dropdownDisplayData[addressFormatItem.name];
            let selectedValue = selectedAddress[addressFormatItem.name];

            if (addressFormatItem.type === AddressItemType.ThreeLetterISORegionName) {
                selectedValue = selectedValue || defaultCountryRegionId;
            }
            input = (
                <AdressDropdownComponent
                    {...{
                        id: elementId,
                        name: addressFormatItem.name,
                        className: 'msc-address-form',
                        value: selectedValue,
                        displayData: displayData,
                        onChange: onDropdownChange,
                        additionalAddributes: getRequriedAttribute(addressFormatItem.validationRules)
                    }}
                />
            );
        }

        return {
            key: addressFormatItem.name,
            AddressItem: { className: className },
            label: <AddressLabelComponent {...{ id: elementId, text: addressFormatItem.label }} />,
            alert: <AddressAlertComponent {...{ message: errorMessage }} />,
            input: input
        };
    });
};

export const AddressAddUpdate = (props: IAddressAddInputProps): IAddressAddUpdateProps => {
    const {
        editAddressHeading,
        addAddressHeading,
        selectedAddress = {},
        resources,
        hasError,
        onCancel,
        onSave,
        hasExternalSubmitGroup,
        isUpdating,
        addressActionResponse
    } = props;
    const heading = selectedAddress.RecordId ? editAddressHeading : addAddressHeading;

    return {
        AddressForm: { className: 'msc-address-form' },
        heading: heading && <Heading className='msc-address-form__heading' {...heading} />,
        items: getAddessItems(selectedAddress, props),
        isShowSaveButton: !hasExternalSubmitGroup,
        saveButton: (
            <AddressButtonComponent
                {...{
                    className: classname('msc-address-form__button-save msc-btn', { 'msc-address-form__button-updating': isUpdating }),
                    text: resources.addressSaveButtonText,
                    ariaLabel: resources.addressSaveButtonAriaLabel,
                    disabled: isUpdating,
                    onClick: onSave
                }}
            />
        ),
        isShowCancelButton: !hasExternalSubmitGroup,
        cancelButton: (
            <AddressButtonComponent
                {...{
                    className: 'msc-address-form__button-cancel msc-btn',
                    text: resources.addressCancelButtonText,
                    ariaLabel: resources.addressCancelButtonAriaLabel,
                    onClick: onCancel
                }}
            />
        ),
        hasError: hasError || false,
        error: {
            AddressError: { className: 'msc-address-form__error' },
            title: addressActionResponse && addressActionResponse.errorTitle && (
                <AddressErrorTitleComponent {...{ title: addressActionResponse.errorTitle || '' }} />
            ),
            message: addressActionResponse && addressActionResponse.errorMessage && (
                <AddressErrorMessageComponent {...{ message: addressActionResponse.errorMessage || '' }} />
            )
        }
    };
};
