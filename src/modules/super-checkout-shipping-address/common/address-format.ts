/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { get, set } from 'mobx';

import {
    Address, CountryRegionInfo, StateProvinceInfo
} from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

import {
    AddressItemType, IAddressDropdownsData, IAddressItem, IAddressValidationRule
} from './address-format.data';
import { AddressMetaData } from './address-meta-data';

/**
 *
 * Retail Service Address format parser
 */
export class AddressFormat {
    private countryRegionsInfo?: CountryRegionInfo[];
    private addressMetaData: AddressMetaData;

    constructor(countryRegionsInfo: CountryRegionInfo[], addressMetaData: AddressMetaData) {
        this.countryRegionsInfo = countryRegionsInfo;
        this.addressMetaData = addressMetaData;
    }

    public getAddressFormat(countryRegionId: string): IAddressItem[] {
        const countryRegionInfo = this._getCountryRegionInfo(countryRegionId);
        if (countryRegionInfo) {
            return this._getAddressDisplayFormat(countryRegionInfo);
        }
        return [];
    }

    public getCountryFormat(): { key?: string; value?: string }[] {
        return (this.countryRegionsInfo || []).map(countryRegion => {
            return {
                key: countryRegion.CountryRegionId,
                value: countryRegion.ShortName
            };
        });
    }

    public getStateFormat(stateProvinceInfo?: StateProvinceInfo[]): { key?: string; value?: string }[] {
        return (stateProvinceInfo || []).map(state => {
            return {
                key: state.StateId,
                value: state.StateName
            };
        });
    }

    public getPrefilledAddressDropdownData = (stateDefaultSelectionText: string, stateProvinceInfo?: StateProvinceInfo[]): IAddressDropdownsData => {
        const defaultStateText = {
            key: '',
            value: stateDefaultSelectionText
        };
        const dropdownData: IAddressDropdownsData = {};

        dropdownData[AddressItemType[AddressItemType.ThreeLetterISORegionName]] = this.getCountryFormat();
        dropdownData[AddressItemType[AddressItemType.State]] = this.getStateFormat(stateProvinceInfo);
        dropdownData[AddressItemType[AddressItemType.State]].unshift(defaultStateText);

        return dropdownData;
    }

    public getTwoLetterISORegionName = (countryRegionId: string): string | undefined => {
        const countryRegionInfo = this._getCountryRegionInfo(countryRegionId);

        return countryRegionInfo!.ISOCode;
    }

    public validateAddressFormat = (address: Address, validationError: Address, countryRegionId: string): boolean => {
        let isValid: boolean = true;
        const addressFormat = this.getAddressFormat((address.ThreeLetterISORegionName) || countryRegionId);

        addressFormat.forEach(addressFormatItem => {
            set(validationError, { [addressFormatItem.name]: null });

            for (const validationRule of (addressFormatItem.validationRules || [])) {
                if (!this._validateRegEx(address, addressFormatItem.name, validationRule)) {
                    set(validationError, { [addressFormatItem.name]: validationRule.message });
                    isValid = false;
                    break;
                }
            }
        });
        return isValid;
    }

    private _validateRegEx = (address: Address, propertyName: string, validationRule: IAddressValidationRule): boolean => {
        if (validationRule.regEx && validationRule.regEx.length > 0) {
            const regex = new RegExp(validationRule.regEx);
            return regex.test(get(address, propertyName) || '');
        }
        return true;
    }

    private _getCountryRegionInfo(countryRegionId: string): CountryRegionInfo | undefined {
        return (this.countryRegionsInfo || []).find(countryRegion => {
            return ((countryRegion.CountryRegionId || '').toLowerCase() === countryRegionId.toLowerCase());
        });
    }

    private _getAddressDisplayFormat(countryRegionInfo: CountryRegionInfo): IAddressItem[] {
        const addressDisplayItem: IAddressItem[] = [];

        if (countryRegionInfo && countryRegionInfo.AddressFormatLines) {
            const nameDisplayItem = this._extendAddressDisplayFormat(AddressItemType.Name, true);
            if (nameDisplayItem) {
                addressDisplayItem.push(nameDisplayItem);
            }

            countryRegionInfo.AddressFormatLines.forEach(formatLine => {
                if (formatLine.AddressComponentNameValue) {
                    const addressItem = this.addressMetaData.getItemFormat(formatLine.AddressComponentNameValue);
                    if (addressItem) {
                        addressItem.isNewLine = formatLine.NewLine || false;
                        addressDisplayItem.push(addressItem);
                    }
                }
            });

            const phoneDisplayItem = this._extendAddressDisplayFormat(AddressItemType.Phone, false);
            if (phoneDisplayItem) {
                addressDisplayItem.push(phoneDisplayItem);
            }
        }

        return addressDisplayItem;
    }

    private _extendAddressDisplayFormat(type: AddressItemType, isNewLine: boolean): IAddressItem | undefined {
        const addressItem = this.addressMetaData.getItemFormat(type);
        if (addressItem) {
            addressItem.isNewLine = isNewLine;
        }
        return addressItem;
    }

}
