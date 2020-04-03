import {
    AddressItemDisplayType, AddressItemType, AddressValidationRuleType, IAddressItem,
    IAddressValidationRule
} from './address-format.data';
import { IAddressResource } from './address-module.data';

/**
 * Address meta data
 */
export class AddressMetaData {

    private metaData: IAddressItem[] = [];
    private resources: IAddressResource;
    private requiredFieldRegEx: string = '\\S';
    private resourcesPrefix: string = 'address';
    private maxLength: number = 64;
    private requiredFields: AddressItemType[];

    constructor(resources: IAddressResource) {
        this.resources = resources || {};
        this.requiredFields = [AddressItemType.Name, AddressItemType.ZipCode, AddressItemType.City, AddressItemType.State, AddressItemType.ThreeLetterISORegionName, AddressItemType.Street];
        this._init();
    }

    public getItemFormat(id: number): IAddressItem | undefined {
        return this.metaData.find((item) => {
            return item.type === id;
        });
    }

    private _init(): void {
        this._addItem(AddressItemType.Name, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.Phone, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.ZipCode, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.City, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.County, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.State, AddressItemDisplayType.Dropdown);
        this._addItem(AddressItemType.ThreeLetterISORegionName, AddressItemDisplayType.Dropdown);
        this._addItem(AddressItemType.Street, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.District, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.StreetNumber, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.BuildingCompliment, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.Postbox, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.House_RU, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.Flat_RU, AddressItemDisplayType.Input);
        this._addItem(AddressItemType.CountryOKSMCode_RU, AddressItemDisplayType.Input);
    }

    private _addItem(type: AddressItemType, displayType: AddressItemDisplayType): void {
        const nameKey = AddressItemType[type].replace('_', '');
        const item: IAddressItem = {
            type,
            displayType,
            name: AddressItemType[type],
            label: this.resources[`${this.resourcesPrefix}${nameKey}Label`],
            maxLength: this.maxLength,
            validationRules: this._validationRules(type, nameKey),
            isNewLine: true
        };

        this.metaData.push(item);
    }

    private _validationRules(type: AddressItemType, name: string): IAddressValidationRule[] {
        const validationRules: IAddressValidationRule[] = [];

        for (const ruleType of Object.keys(AddressValidationRuleType)) {
            const key = `${this.resourcesPrefix}${name}${ruleType}`;
            const message = this.resources[`${key}ErrorMessage`];
            switch (ruleType) {
                case AddressValidationRuleType.Required: {
                    if (this.requiredFields.find((itemType: AddressItemType) => itemType === type)) {
                        validationRules.push(this._validationRule(ruleType, this.requiredFieldRegEx, message));
                    }
                    break;
                }
                default:
            }
        }
        return validationRules;
    }

    private _validationRule(type: AddressValidationRuleType, regEx: string, message: string): IAddressValidationRule {
        return {
            type,
            regEx,
            message
        };
    }

}