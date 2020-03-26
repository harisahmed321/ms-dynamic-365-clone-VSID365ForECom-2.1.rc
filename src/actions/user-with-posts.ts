/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';
// tslint:disable-next-line: ordered-imports
import { IPostsData, getPostsAction } from './posts';
// tslint:disable-next-line: ordered-imports
import { IUserData, UserInput, getUserAction } from './user';

// TODO: Create a data model here or import one to capture the response of the action
export interface IUserWithPostsData extends IUserData {
    posts?: IPostsData[];
}

async function getUserWithPostsAction(input: UserInput, ctx: Msdyn365.IActionContext): Promise<IUserWithPostsData> {
    console.log('getUserWithPostsAction');
    const user: IUserWithPostsData = await getUserAction(input, ctx);
    if (user) {
        user.posts = await getPostsAction(input, ctx);
        return user;
    } else {
        return <IUserWithPostsData>{};
    }
}

export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IUserWithPostsData>>getUserWithPostsAction
});
