import { buildHydratedMockActionContext } from '@msdyn365-commerce/core';
import mockCountryRegions from './country-regions';
import mockUsStates from './us-states';

const countries = [...mockCountryRegions];
const states = [...mockUsStates];

const mockActionContext = buildHydratedMockActionContext({});

// @ts-ignore
mockActionContext.chainAction = jest.fn((action, input) => {
    if (input) {
        // @ts-ignore
        const cacheObjectType: string = input._cacheObjectType;
        if (cacheObjectType === 'CountryRegionInfo') {
            return Promise.resolve(countries);
        }

        if (cacheObjectType === 'StateProvinceInfo') {
            return Promise.resolve(states);
        }
    }
});

export default mockActionContext;
