/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import { IModuleStateManager } from '@msdyn365-commerce-modules/checkout-utilities';
import { shallow } from 'enzyme';
import * as React from 'react';
import GuidedCardComponent from '../../components/guided-card';
import GuidedFormComponent, { ICheckoutGuidedFormProps } from '../../components/guided-form';
import { mockResources } from '../__mock__';

let mockProps: ICheckoutGuidedFormProps;

let mockModuleState: IModuleStateManager;

const mockItem1 = {
    props: {
        id: 'mock-item-1',
        config: {
            heading: 'mock-heading-1'
        }
    }
};

const mockItem2 = {
    props: {
        id: 'mock-item-2',
        config: {
            heading: 'mock-heading-2'
        }
    }
};

describe('Checkout unit tests - Guided card', () => {
    beforeEach(() => {
        // @ts-ignore: mock partial data
        mockModuleState = {
            childIds: ['mock-item-1', 'mock-item-2'],
            init: jest.fn(),
            // @ts-ignore
            getModule: jest.fn(() => ({
                hasModuleState: true,
                isDisabled: false
            }))
        };

        mockProps = {
            items: [mockItem1, mockItem2],
            resource: mockResources,
            moduleState: mockModuleState
        };
    });

    it('renders correctly', () => {
        const wrapper = shallow(<GuidedFormComponent {...mockProps} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('handles onNext', () => {
        const wrapper = shallow(<GuidedFormComponent {...mockProps} />);

        let guidedCards = wrapper.find(GuidedCardComponent);
        expect(guidedCards).toHaveLength(2);

        // @ts-ignore
        expect(wrapper.instance().state.currentStep).toBe(0);

        expect(guidedCards.at(0).props()).toMatchObject({
            title: 'mock-heading-1',
            step: 0,
            disabled: false,
            isActive: true,
            isVisted: false,
            isExpanded: true
        });

        expect(guidedCards.at(1).props()).toMatchObject({
            title: 'mock-heading-2',
            step: 1,
            disabled: false,
            isActive: false,
            isVisted: false,
            isExpanded: false
        });

        // @ts-ignore
        wrapper.instance().onNext(); // Move to the next step
        guidedCards = wrapper.find(GuidedCardComponent);

        // @ts-ignore
        expect(wrapper.instance().state.currentStep).toBe(1);

        expect(guidedCards.at(0).props()).toMatchObject({
            title: 'mock-heading-1',
            step: 0,
            disabled: false,
            isActive: false,
            isVisted: true,
            isExpanded: true
        });

        expect(guidedCards.at(1).props()).toMatchObject({
            title: 'mock-heading-2',
            step: 1,
            disabled: false,
            isActive: true,
            isVisted: false,
            isExpanded: true
        });

        // @ts-ignore
        wrapper.instance().onNext(); // Move to the final step
        guidedCards = wrapper.find(GuidedCardComponent);

        // @ts-ignore
        expect(wrapper.instance().state.currentStep).toBe(2);

        expect(guidedCards.at(0).props()).toMatchObject({
            title: 'mock-heading-1',
            step: 0,
            disabled: false,
            isActive: false,
            isVisted: true,
            isExpanded: true
        });

        expect(guidedCards.at(1).props()).toMatchObject({
            title: 'mock-heading-2',
            step: 1,
            disabled: false,
            isActive: false,
            isVisted: true,
            isExpanded: true
        });
    });

    it('disables the disabled item', () => {
        mockProps = {
            ...mockProps,
            moduleState: {
                ...mockModuleState,
                // @ts-ignore
                getModule: jest.fn(id => ({
                    hasModuleState: true,
                    isDisabled: id === 'mock-item-1'
                }))
            }
        };

        const wrapper = shallow(<GuidedFormComponent {...mockProps} />);

        let guidedCards = wrapper.find(GuidedCardComponent);

        // @ts-ignore
        expect(wrapper.instance().state.currentStep).toBe(0);

        expect(guidedCards.at(0).props()).toMatchObject({
            title: 'mock-heading-1',
            step: -1,
            disabled: true,
            isActive: false,
            isVisted: false,
            isExpanded: false
        });

        expect(guidedCards.at(1).props()).toMatchObject({
            title: 'mock-heading-2',
            step: 0,
            disabled: false,
            isActive: true,
            isVisted: false,
            isExpanded: true
        });

        // @ts-ignore
        wrapper.instance().onNext(); // Move to the final step
        guidedCards = wrapper.find(GuidedCardComponent);

        // @ts-ignore
        expect(wrapper.instance().state.currentStep).toBe(1);

        expect(guidedCards.at(0).props()).toMatchObject({
            title: 'mock-heading-1',
            step: -1,
            disabled: true,
            isActive: false,
            isVisted: false,
            isExpanded: false
        });

        expect(guidedCards.at(1).props()).toMatchObject({
            title: 'mock-heading-2',
            step: 0,
            disabled: false,
            isActive: false,
            isVisted: true,
            isExpanded: true
        });
    });
});
