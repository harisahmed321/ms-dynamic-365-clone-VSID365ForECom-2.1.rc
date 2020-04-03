import { Heading } from '@msdyn365-commerce-modules/data-types';
import { Address } from '@msdyn365-commerce/retail-proxy';

export enum AddressOperation {
    Add = 'Add',
    Show = 'Show',
    Update = 'Update',
    List = 'List'
}

export enum AddressType {
    Shipping = 'Shipping',
    Billing = 'Billing'
}

export interface IDropdownDisplayData {
    [index: string]: { key?: string; value?: string }[];
}

export interface IAddressResponse {
    errorTitle?: string;
    errorMessage?: string;
    customerAddresses?: Address[];
    address?: Address;
}

export interface IAddressConfig {
    heading?: Heading;
    primaryAddressSectionHeading?: Heading;
    otherAddressSectionHeading?: Heading;
    addAddressHeading?: Heading;
    editAddressHeading?: Heading;
}

export interface IAddressResource {
    addressAddButtonText: string;
    addressAddButtonAriaLabel: string;
    addressPrimaryButtonText: string;
    addressPrimaryButtonAriaLabel: string;
    addressEditButtonText: string;
    addressEditButtonAriaLabel: string;
    addressSaveButtonText: string;
    addressSaveButtonAriaLabel: string;
    addressCancelButtonText: string;
    addressCancelButtonAriaLabel: string;
    addressStateDefaultSelectionText: string;
    addressNameLabel: string;
    addressNameRequiredErrorMessage: string;
    addressPhoneLabel: string;
    addressPhoneRequiredErrorMessage: string;
    addressZipCodeLabel: string;
    addressZipCodeRequiredErrorMessage: string;
    addressCityLabel: string;
    addressCityRequiredErrorMessage: string;
    addressCountyLabel: string;
    addressCountyRequiredErrorMessage: string;
    addressStateLabel: string;
    addressStateRequiredErrorMessage: string;
    addressThreeLetterISORegionNameLabel: string;
    addressThreeLetterISORegionNameRequiredErrorMessage: string;
    addressStreetRequiredErrorMessage: string;
    addressDistrictLabel: string;
    addressDistrictRequiredErrorMessage: string;
    addressStreetNumberLabel: string;
    addressStreetNumberRequiredErrorMessage: string;
    addressBuildingComplimentLabel: string;
    addressBuildingComplimentRequiredErrorMessage: string;
    addressPostboxLabel: string;
    addressPostboxRequiredErrorMessage: string;
    addressHouseRULabel: string;
    addressHouseRURequiredErrorMessage: string;
    addressFlatRULabel: string;
    addressFlatRURequiredErrorMessage: string;
    addressCountryOKSMCodeRULabel: string;
    addressCountryOKSMCodeRURequiredErrorMessage: string;
    addressErrorMessageTitle: string;
    addressGenericErrorMessage: string;
    addressEmptyListAddressMessage: string;
}