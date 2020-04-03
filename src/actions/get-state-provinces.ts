import { buildCacheKey } from '@msdyn365-commerce-modules/retail-actions';
import {
    CacheType, createObservableDataAction, IAction, IActionContext, IActionInput, ICommerceApiSettings
} from '@msdyn365-commerce/core';
import {
    getStateProvincesAsync
} from '@msdyn365-commerce/retail-proxy/dist/DataActions/StoreOperationsDataActions.g';
import { StateProvinceInfo } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

/**
 * Input class for get state provinces data action
 */
export class GetStateProvincesInput implements IActionInput {
    public countryRegionId: string;
    private apiSettings: ICommerceApiSettings;

    constructor(countryRegionId: string, apiSettings: ICommerceApiSettings) {
        this.countryRegionId = countryRegionId;
        this.apiSettings = apiSettings;
    }

    public getCacheKey = () => buildCacheKey(`StateProvinceInfo-${this.countryRegionId}`, this.apiSettings);
    public getCacheObjectType = () => 'StateProvinceInfo';
    public dataCacheType = (): CacheType => 'request';
}

export async function getStateProvinceAction(input: GetStateProvincesInput, ctx: IActionContext): Promise<StateProvinceInfo[]> {
    return getStateProvincesAsync({ callerContext: ctx, queryResultSettings: {} }, input.countryRegionId);
}

export default createObservableDataAction({
    action: <IAction<StateProvinceInfo[]>>getStateProvinceAction
});
