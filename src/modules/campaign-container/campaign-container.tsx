/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';

import { ICampaignContainerData } from './campaign-container.data';
import { ICampaignContainerProps } from './campaign-container.props.autogenerated';

export interface ICampaignContainerViewProps extends ICampaignContainerProps<ICampaignContainerData> {

}

/**
 *
 * CampaignContainer component
 * @extends {React.PureComponent<ICampaignContainerProps<ICampaignContainerData>>}
 */
class CampaignContainer extends React.PureComponent<ICampaignContainerProps<ICampaignContainerData>> {
    public render(): JSX.Element | null {

        return this.props.renderView(this.props);
    }
}

export default CampaignContainer;
