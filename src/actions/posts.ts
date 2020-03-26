/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';
import { UserInput } from './user';

// TODO: Create a data model here or import one to capture the response of the action
export interface IPostsData {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export async function getPostsAction(input: UserInput, ctx: Msdyn365.IActionContext): Promise<IPostsData[]> {
    const requestUrl = `https://jsonplaceholder.typicode.com/users/${input.userId}/posts`;
    return Msdyn365.sendCommerceRequest<IPostsData>(requestUrl, 'get')
        .then((response: Msdyn365.IHTTPResponse) => {
            if (response.data) {
                return <IPostsData[]>response.data;
            }
            ctx.trace('[getPostAction] Invalid response from server');
            return <IPostsData[]>[];
        })
        .catch((error: Msdyn365.IHTTPError) => {
            ctx.trace(error.message);
            ctx.trace(error.stack || '');
            ctx.trace(`Unable to Fetch Product.`);
            return <IPostsData[]>[];
        });
}

export const IPostsAction = Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IPostsData[]>>getPostsAction
});

export default IPostsAction;
