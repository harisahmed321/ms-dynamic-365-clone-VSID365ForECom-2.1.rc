/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { ICampaignContainerViewProps } from './campaign-container';

export default (props: ICampaignContainerViewProps) => {
    const { slots } = props;
    return (
        <div className='row'>
            {slots.slot1[0]}
            {slots.slot2[0]}
        </div>
    );
};
