/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/ //
import { Heading as HeadingType } from '@msdyn365-commerce-modules/data-types';
import { Button } from '@msdyn365-commerce-modules/utilities';
import classname from 'classnames';
import * as React from 'react';
import ReactDOM from 'react-dom';

export interface ICheckoutGuidedCardProps {
    step: number;
    title?: HeadingType;
    disabled?: boolean; // module is not available
    isActive?: boolean; // step === currentStep
    isVisted?: boolean; // step < currentStep
    isExpanded?: boolean;
    isReady?: boolean;
    isPending?: boolean;
    isUpdating?: boolean;
    isSubmitting?: boolean;
    isMobile?: boolean;
    hasInitialized?: boolean;
    hasControlGroup?: boolean;
    children: React.ReactNode;
    resource: {
        checkoutStepTitleFormat: string;
        saveBtnLabel: string;
        changeBtnLabel: string;
        cancelBtnLabel: string;
        saveAndContinueBtnLabel: string;
    };
    onEdit?(): void;
    onCancel?(): void;
    onSubmit?(): void;
    onNext(): void;
}

/**
 *
 * CheckoutGuidedCard component
 * @extends {React.Component<ICheckoutGuidedCardProps>}
 */
class CheckoutGuidedCard extends React.PureComponent<ICheckoutGuidedCardProps> {
    private editButtonRef: React.RefObject<HTMLButtonElement> = React.createRef();
    private formCardRef: React.RefObject<HTMLDivElement> = React.createRef();

    public componentDidUpdate(prevProps: ICheckoutGuidedCardProps): void {
        /**
         * Move to next step when current step is ready
         */
        const { isActive, isReady, onNext, isVisted, onEdit } = this.props;

        // Move to next step after completing the current step
        if (isActive && isReady) {
            onNext();
        }

        // Set the focus to Edit button once edit button appear
        // (It happens when current step switch to isReady status)
        const prevCanEdit = prevProps.isReady && prevProps.isVisted && !!prevProps.onEdit;
        const canEdit = isReady && isVisted && !!onEdit;
        if (!prevCanEdit && canEdit) {
            this.focusOnEditButton();
            this.scrollToTitle();
        }

        // Set the focus to the first focusable element
        // (It happens when current step switch to isUpdating status)
        if (prevProps.isReady && !isReady) {
            this.focusOnFirstFocusableElement();
        }
    }

    public render(): JSX.Element | null {
        const {
            title,
            disabled,
            isExpanded,
            isActive,
            isVisted,
            children,
            isReady,
            isPending,
            isUpdating,
            hasInitialized,
            hasControlGroup,
            onEdit,
            resource
        } = this.props;
        const { changeBtnLabel } = resource;

        const canEdit = hasControlGroup && isReady && isVisted && onEdit;

        return (
            <div
                className={classname('ms-checkout__guided-card', {
                    active: isActive,
                    expanded: isExpanded,
                    closed: !isExpanded,
                    visted: isVisted,
                    hidden: disabled,
                    initialized: hasInitialized,
                    disabled: disabled,
                    ready: isReady,
                    pending: isPending,
                    updating: isUpdating
                })}
                ref={this.formCardRef}
            >
                <div className='ms-checkout__guided-card-header'>
                    {this.getTitle()}

                    {canEdit && (
                        <Button
                            innerRef={this.editButtonRef}
                            className='ms-checkout__guided-card-btn-edit'
                            title={changeBtnLabel}
                            color='link'
                            onClick={onEdit}
                            aria-label={title && title.text ? `${changeBtnLabel} ${title.text}` : ''}
                        >
                        {changeBtnLabel}
                        </Button>
                    )}
                </div>

                <div
                    className={classname('ms-checkout__guided-card-body', {
                        hidden: !isExpanded
                    })}
                >
                    <div className='ms-checkout__guided-card-content'>{children}</div>

                    {this.renderFooder()}
                </div>
            </div>
        );
    }

    private renderFooder = (): JSX.Element | null => {
        const { isVisted, isReady, isSubmitting, hasControlGroup, onCancel, onSubmit, resource } = this.props;
        const { saveBtnLabel, cancelBtnLabel, saveAndContinueBtnLabel } = resource;

        const canSubmit = !isReady && onSubmit;
        const canCancel = !isReady && isVisted && onCancel;

        if (!hasControlGroup || (!canSubmit && !canCancel)) {
            return null;
        }

        return (
            <div className='ms-checkout__guided-card-footer'>
                {canSubmit && (
                    <Button
                        className={classname('ms-checkout__guided-card-btn-save', { 'is-submitting': isSubmitting })}
                        title={isVisted ? saveBtnLabel : saveAndContinueBtnLabel}
                        color='primary'
                        disabled={isSubmitting}
                        onClick={onSubmit}
                    >
                        {isVisted ? saveBtnLabel : saveAndContinueBtnLabel}
                    </Button>
                )}
                {canCancel && (
                    <Button
                        className='ms-checkout__guided-card-btn-cancel'
                        title={cancelBtnLabel}
                        color='secondary'
                        onClick={onCancel}
                    >
                        {cancelBtnLabel}
                    </Button>
                )}
            </div>
        );
    };

    private focusOnFirstFocusableElement = (): void => {
        const node = ReactDOM.findDOMNode(this) as HTMLElement;
        const focussableElements = `
             a:not([disabled]),
             button:not([disabled]),
             input[type=submit]:not([disabled]),
             input[type=checkbox]:not([disabled]),
             input[type=text]:not([disabled]),
             input[type=radio]:not([disabled]),
             input[type=password]:not([disabled]),
             select:not([disabled]),
             textarea:not([disabled]),
             [tabindex]:not([disabled]):not([tabindex="-1"])
         `;

        const child = node && node.querySelector && (node.querySelector(focussableElements) as HTMLElement);
        child && child.focus && child.focus();
    };

    private focusOnEditButton = (): void => {
        // Focus on edit button
        const editButton =
            this.editButtonRef &&
            this.editButtonRef.current &&
            this.editButtonRef.current.focus &&
            (this.editButtonRef.current as HTMLElement);
        editButton && editButton.focus();
    };

    private scrollToTitle = (): void => {
        // scroll window to the title of the step that was just completed only in mobile viewport
        const formCard = this.props.isMobile && this.formCardRef && this.formCardRef.current && (this.formCardRef.current as HTMLElement);
        formCard && formCard.scrollIntoView();
    };

    private getTitle = (): JSX.Element => {
        const { step, title } = this.props;
        const { headingTag: Tag = 'h2', text = '' } = title || {};
        return (
            <Tag className='ms-checkout__guided-card-title'>
                <span className='ms-checkout__guided-card-title-step'>{step + 1}. </span>
                {text && <span className='ms-checkout__guided-card-title-text'>{text}</span>}
            </Tag>
        );
    };
}

export default CheckoutGuidedCard;
