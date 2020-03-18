/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';

import { ICampaignPageContainerData } from './campaign-page-container.data';
import { ICampaignPageContainerProps } from './campaign-page-container.props.autogenerated';

export interface ICampaignPageContainerViewProps extends ICampaignPageContainerProps<ICampaignPageContainerData> {

}

/**
 *
 * CampaignPageContainer component
 * @extends {React.PureComponent<ICampaignPageContainerProps<ICampaignPageContainerData>>}
 */
class CampaignPageContainer extends React.PureComponent<ICampaignPageContainerProps<ICampaignPageContainerData>> {
    public render(): JSX.Element | null {

        return this.props.renderView(this.props);
    }
}

export default CampaignPageContainer;