import { addAddress, AddressManagementInput, updateAddress, updatePrimaryAddress } from '@msdyn365-commerce-modules/retail-actions';
import { IActionInput, ICoreContext, IObservableAction, ITelemetry } from '@msdyn365-commerce/core';
import { Address, CountryRegionInfo, StateProvinceInfo } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

import { getStateProvinceAction, GetStateProvincesInput } from './../../../actions/get-state-provinces';
import { IAddressResource, IAddressResponse } from './address-module.data';

/**
 *
 * Address common
 */
export class AddressCommon {
    private context: ICoreContext;
    private customerAccountNumber?: string;
    private resources: IAddressResource;
    private telemetry: ITelemetry;

    constructor(context: ICoreContext, resources: IAddressResource, telemetry: ITelemetry, customerAccountNumber?: string) {
        this.context = context;
        this.customerAccountNumber = customerAccountNumber;
        this.resources = resources;
        this.telemetry = telemetry;
    }

    public getDefaultCountryRegionId = (countryRegionId: string, countryRegions: CountryRegionInfo[], market?: string): string => {
        const marketISOCode = market || 'US';
        const currentCountryRegion = countryRegions.find(countryRegion => (countryRegion.ISOCode || '') === marketISOCode);
        return (currentCountryRegion && currentCountryRegion.CountryRegionId) || countryRegionId;
    };

    public parseRetailException = (resources: IAddressResource): IAddressResponse => {
        return {
            errorTitle: resources.addressErrorMessageTitle,
            errorMessage: resources.addressGenericErrorMessage
        };
    };

    public isAuthenticatedFlow = (): boolean => {
        return !!this.customerAccountNumber;
    };

    public getStateProvinces = async (countryRegionId: string): Promise<StateProvinceInfo[]> => {
        let response: StateProvinceInfo[] = [];
        if (this.context && this.context.actionContext) {
            try {
                const input = new GetStateProvincesInput(countryRegionId, this.context.request.apiSettings);
                response = await getStateProvinceAction(input, this.context.actionContext);
            } catch (error) {
                if (this.telemetry) {
                    this.telemetry.error(`Error encountered ${error}`);
                }
            }
        }
        return Promise.resolve(response);
    };

    public addCustomerAddress = (address: Address): Promise<IAddressResponse> => {
        return this.submitCustomerAddress(addAddress, address);
    };

    public updateCustomerAddress = (address: Address): Promise<IAddressResponse> => {
        return this.submitCustomerAddress(updateAddress, address);
    };

    public updateCustomerPrimaryAddress = (address: Address): Promise<IAddressResponse> => {
        return this.submitCustomerAddress(updatePrimaryAddress, address);
    };

    private submitCustomerAddress = (addressAction: IObservableAction<Address[]>, address: Address): Promise<IAddressResponse> => {
        const input = new AddressManagementInput(address, this.customerAccountNumber || '');
        return this.execAddressAction(addressAction, input, address);
    };

    private execAddressAction = async (
        addressAction: IObservableAction<Address[]>,
        input: IActionInput | IActionInput[],
        address: Address
    ): Promise<IAddressResponse> => {
        let response: IAddressResponse = {};

        if (this.context && this.context.actionContext) {
            try {
                const addresses = await addressAction(input, this.context.actionContext);
                if (addresses.length > 0) {
                    response.address = address.RecordId ? address : addresses[addresses.length - 1];
                }
                response.customerAddresses = addresses;
            } catch (error) {
                if (this.telemetry) {
                    this.telemetry.error(`Error encountered ${error}`);
                }
                response = this.parseRetailException(this.resources);
            }
        }
        return Promise.resolve(response);
    };
}
