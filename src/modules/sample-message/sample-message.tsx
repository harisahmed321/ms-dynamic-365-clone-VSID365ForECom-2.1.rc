/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';

import { ISampleMessageData } from './sample-message.data';
import { ISampleMessageProps } from './sample-message.props.autogenerated';

/**
 *
 * SampleMessage component
 * @extends {React.PureComponent<ISampleMessageProps<ISampleMessageData>>}
 */
export default class SampleMessage extends React.PureComponent<ISampleMessageProps<ISampleMessageData>> {
    public render(): JSX.Element {
        if (this.props.data.sampleState.result) {
            return <h3>The Button has been clicked {this.props.data.sampleState.result.clickCount} times.</h3>;
        }
        return <h3>Error: No Sample State Detected</h3>;
    }
}