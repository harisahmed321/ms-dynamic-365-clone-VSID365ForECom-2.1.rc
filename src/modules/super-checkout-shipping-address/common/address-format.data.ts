export enum AddressItemDisplayType {
    Input = 'Input',
    Dropdown = 'Dropdown'
}

export enum AddressValidationRuleType {
    Required = 'Required',
    Format = 'Format'
}

export enum AddressItemType {
    Name = 1001,
    Phone = 1002,
    ZipCode = 1,
    City = 2,
    County = 3,
    State = 4,
    ThreeLetterISORegionName = 5,
    Street = 6,
    District = 7,
    StreetNumber = 8,
    BuildingCompliment = 9,
    Postbox = 10,
    House_RU = 21,
    Flat_RU = 22,
    CountryOKSMCode_RU = 23,
}

export interface IAddressItem {
    name: string;
    type: AddressItemType;
    label: string;
    maxLength: number;
    displayType: AddressItemDisplayType;
    validationRules?: IAddressValidationRule[];
    isNewLine: boolean;
}

export interface IAddressValidationRule {
    type: AddressValidationRuleType;
    regEx: string;
    message: string;
}

export interface IAddressDropdownsData {
    [index: string]: { key?: string; value?: string }[];
}