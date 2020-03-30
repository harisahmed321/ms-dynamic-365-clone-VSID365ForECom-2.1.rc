/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import { shallow } from 'enzyme';
import * as React from 'react';
import PlaceOrderButton from '../../components/place-order-button';

describe('Checkout unit tests - PlaceOrderButton', () => {
    it('renders correctly', () => {
        const mockProps = {
            placeOrderText: 'Place order',
            canPlaceOrder: true,
            placeOrder: jest.fn()
        };
        const component = shallow(<PlaceOrderButton {...mockProps} />);
        expect(component).toMatchSnapshot();
        const button = component.find('.ms-checkout__btn-place-order');
        button.simulate('click');
        expect(mockProps.placeOrder).toBeCalled();
    });

    it('renders correctly when canPlaceOrder is false', () => {
        const mockProps = {
            placeOrderText: 'Place order',
            canPlaceOrder: false,
            placeOrder: jest.fn()
        };
        const component = shallow(<PlaceOrderButton {...mockProps} />);
        expect(component).toMatchSnapshot();
        const button = component.find('.ms-checkout__btn-place-order');
        expect(button.prop('disabled')).toBe(true);
        button.simulate('click');
        expect(mockProps.placeOrder).not.toBeCalled();
    });
});
