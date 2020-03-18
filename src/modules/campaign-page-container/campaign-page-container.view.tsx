/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { ICampaignPageContainerViewProps } from './campaign-page-container';

export default (props: ICampaignPageContainerViewProps) => {
    const { slots } = props;
    console.log(slots.primary[0]);
    return (
        <div>
            {/* <div className='row'>{slots.header[0]}</div> */}
            <div className='row'>{slots.primary[0]}</div>
            {/* <div className='row'>{slots.footer[0]}</div> */}
        </div>
    );
};
