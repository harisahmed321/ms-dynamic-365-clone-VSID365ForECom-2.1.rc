/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';

/**
 * User Input Action
 */

export class UserInput implements Msdyn365.IActionInput {
    public userId: number;
    constructor(userId: number) {
        this.userId = userId;
    }

    // TODO: Determine if the results of this get action should cache the results and if so provide
    // a cache object type and an appropriate cache key
    public getCacheKey = () => `user`;
    public getCacheObjectType = () => 'user';
    public dataCacheType = (): Msdyn365.CacheType => 'application';
}

// TODO: Create a data model here or import one to capture the response of the action
export interface IUserData {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {};
    phone: string;
    website: string;
    company: {};
}

export async function getUserAction(input: UserInput, ctx: Msdyn365.IActionContext): Promise<IUserData> {
    console.log('getUserAction');
    const requestUrl = `https://jsonplaceholder.typicode.com/users/${input.userId}`;
    return Msdyn365.sendCommerceRequest<IUserData>(requestUrl, 'get')
        .then((response: Msdyn365.IHTTPResponse) => {
            if (response.data) {
                return <IUserData>response.data;
            }
            ctx.trace('[getUserAction] Invalid response from server');
            return <IUserData>{};
        })
        .catch((error: Msdyn365.IHTTPError) => {
            ctx.trace(error.message);
            ctx.trace(error.stack || '');
            ctx.trace(`Unable to Fetch Product.`);
            return <IUserData>{};
        });
}

export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IUserData>>getUserAction
});
