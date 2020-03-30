/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import { shallow } from 'enzyme';
import * as React from 'react';
import AlertComponent from '../../components/alert';

describe('Checkout unit tests - Alert', () => {
    it('renders correctly', () => {
        const mockProps = {
            message: 'mock error'
        };
        const component = shallow(<AlertComponent {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});
