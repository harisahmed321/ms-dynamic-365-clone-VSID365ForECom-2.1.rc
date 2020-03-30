/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import { mount, render, shallow } from 'enzyme';
import * as React from 'react';
import GuidedCardComponent, { ICheckoutGuidedCardProps } from '../../components/guided-card';
import { mockResources } from '../__mock__';

const CARD_WRAPPER = '.ms-checkout__guided-card';
const CARD_BODY = '.ms-checkout__guided-card-body';
const EDIT_BTN = '.ms-checkout__guided-card-btn-edit';
const SAVE_BTN = '.ms-checkout__guided-card-btn-save';
const CANCEL_BTN = '.ms-checkout__guided-card-btn-cancel';
const CARD_TITLE = '.ms-checkout__guided-card-title';

let mockProps: ICheckoutGuidedCardProps;

describe('Checkout unit tests - Guided card', () => {
    beforeEach(() => {
        mockProps = {
            step: 0,
            title: {
                headingTag: 'h1',
                text: 'Mock Title'
            },
            disabled: false,
            isActive: false,
            isVisted: false,
            isExpanded: false,
            isReady: false,
            hasControlGroup: true,
            children: 'Children',
            resource: mockResources,
            onEdit: jest.fn(),
            onCancel: jest.fn(),
            onSubmit: jest.fn(),
            onNext: jest.fn()
        };
    });

    it('renders correctly', () => {
        mockProps = {
            ...mockProps,
            disabled: false,
            isActive: false,
            isReady: true,
            isVisted: true,
            isExpanded: true
        };
        const wrapper = render(<GuidedCardComponent {...mockProps} />);
        expect(wrapper.find(CARD_TITLE).text()).toBe('1. Mock Title');
        expect(wrapper).toMatchSnapshot();
    });

    it('handles disabled', () => {
        mockProps = {
            ...mockProps,
            disabled: true,
            isActive: false,
            isReady: false,
            isVisted: false,
            isExpanded: false
        };
        const wrapper = shallow(<GuidedCardComponent {...mockProps} />);
        expect(wrapper.find(CARD_WRAPPER).hasClass('hidden')).toBe(true);
    });

    it('handles waiting state', () => {
        mockProps = {
            ...mockProps,
            disabled: false,
            isActive: false,
            isReady: false,
            isVisted: false,
            isExpanded: false
        };
        const wrapper = shallow(<GuidedCardComponent {...mockProps} />);
        // expect(wrapper.find(`${CARD_BODY}.hidden`)).toHaveLength(1);
        expect(wrapper.find(CARD_BODY).hasClass('hidden')).toBe(true);
    });

    it('handles updating and without seleced item state', () => {
        mockProps = {
            ...mockProps,
            disabled: false,
            isActive: true,
            isReady: false,
            isVisted: false,
            isExpanded: true
        };
        const wrapper = shallow(<GuidedCardComponent {...mockProps} />);
        expect(wrapper.find(EDIT_BTN)).toHaveLength(0);
        expect(wrapper.find(SAVE_BTN)).toHaveLength(1);
        expect(wrapper.find(CANCEL_BTN)).toHaveLength(0);
        expect(wrapper.find(SAVE_BTN).props().title).toBe(mockResources.saveAndContinueBtnLabel);
    });

    it('handles updating and with selected item state', () => {
        mockProps = {
            ...mockProps,
            disabled: false,
            isActive: true,
            isReady: false,
            isVisted: true,
            isExpanded: true
        };
        const wrapper = shallow(<GuidedCardComponent {...mockProps} />);
        expect(wrapper.find(EDIT_BTN)).toHaveLength(0);
        expect(wrapper.find(SAVE_BTN)).toHaveLength(1);
        expect(wrapper.find(CANCEL_BTN)).toHaveLength(1);
        expect(wrapper.find(SAVE_BTN).props().title).toBe(mockResources.saveBtnLabel);
    });

    it('handles ready state', () => {
        mockProps = {
            ...mockProps,
            disabled: false,
            isActive: false,
            isReady: true,
            isVisted: true,
            isExpanded: true
        };
        const wrapper = shallow(<GuidedCardComponent {...mockProps} />);
        expect(wrapper.find(EDIT_BTN)).toHaveLength(1);
        expect(wrapper.find(SAVE_BTN)).toHaveLength(0);
        expect(wrapper.find(CANCEL_BTN)).toHaveLength(0);
    });

    it('handles when submitting', () => {
        mockProps = {
            ...mockProps,
            isActive: true,
            isReady: false,
            isVisted: true,
            isExpanded: true,
            isSubmitting: true
        };
        const wrapper = shallow(<GuidedCardComponent {...mockProps} />);
        expect(wrapper.find(SAVE_BTN).hasClass('is-submitting')).toBe(true);
    });

    it('handles not title provide', () => {
        mockProps = {
            ...mockProps,
            title: undefined,
            isActive: true,
            isReady: false,
            isVisted: true,
            isExpanded: true
        };
        const wrapper = shallow(<GuidedCardComponent {...mockProps} />);
        expect(wrapper.find('.ms-checkout__guided-card-title').text()).toBe('1. ');
    });

    it('moves to next section when ready', () => {
        mockProps = {
            ...mockProps,
            isActive: true,
            isReady: true
        };
        const wrapper = shallow(<GuidedCardComponent {...mockProps} />);
        const instance = wrapper.instance() as GuidedCardComponent;
        instance.componentDidUpdate({} as ICheckoutGuidedCardProps);
        expect(mockProps.onNext).toBeCalled();
    });

    it('set the focus to the first focusable element when current step switch to isUpdating status', () => {
        mockProps = {
            ...mockProps,
            isActive: true,
            isReady: false
        };
        const mockPrevProps: ICheckoutGuidedCardProps = {
            ...mockProps,
            isActive: true,
            isReady: true
        };
        const wrapper = mount(<GuidedCardComponent {...mockProps} />);
        const instance = wrapper.instance() as GuidedCardComponent;
        // @ts-ignore
        const spyFocusOnFirstFocusableElement = jest.spyOn(instance, 'focusOnFirstFocusableElement');
        instance.componentDidUpdate(mockPrevProps);
        expect(spyFocusOnFirstFocusableElement).toHaveBeenCalled();
    });

    it('set the focus to Edit button once edit button appear when current step switch to isReady status', () => {
        mockProps = {
            ...mockProps,
            isVisted: true,
            isReady: true
        };
        const mockPrevProps: ICheckoutGuidedCardProps = {
            ...mockProps,
            isVisted: true,
            isReady: false
        };
        const wrapper = mount(<GuidedCardComponent {...mockProps} />);
        const instance = wrapper.instance() as GuidedCardComponent;
        // @ts-ignore
        const spyFocusOnEditButton = jest.spyOn(instance, 'focusOnEditButton');
        // @ts-ignore
        const spyScrollToTitle = jest.spyOn(instance, 'scrollToTitle');
        instance.componentDidUpdate(mockPrevProps);
        expect(spyFocusOnEditButton).toHaveBeenCalled();
        expect(spyScrollToTitle).toHaveBeenCalled();
    });
});
