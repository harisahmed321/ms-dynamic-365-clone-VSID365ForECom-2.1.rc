/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/ //
import { IModuleStateManager } from '@msdyn365-commerce-modules/checkout-utilities';
import { Heading } from '@msdyn365-commerce-modules/data-types';
import get from 'lodash/get';
import { observer } from 'mobx-react';
import * as React from 'react';
import GuidedCard from '../components/guided-card';

export interface ICheckoutGuidedFormProps {
    items: React.ReactNode[];
    moduleState: IModuleStateManager;
    disableGuidedCheckoutFlow?: boolean;
    isMobile?: boolean;
    isEditor?: boolean;
    resource: {
        checkoutStepTitleFormat: string;
        saveBtnLabel: string;
        changeBtnLabel: string;
        cancelBtnLabel: string;
        saveAndContinueBtnLabel: string;
    };
}

interface ICheckoutGuidedFormState {
    currentStep: number;
}

/**
 *
 * CheckoutGuidedForm component
 * @extends {React.Component<ICheckoutGuidedFormProps>}
 */
@observer
class CheckoutGuidedForm extends React.Component<ICheckoutGuidedFormProps> {
    public state: ICheckoutGuidedFormState = {
        currentStep: 0
    };

    public componentDidMount(): void {
        /**
         * Append child modules
         */
        const childIds = this.props.items.map((item: React.ReactNode) => get(item, 'props.id'));
        this.props.moduleState.init({ childIds });
    }

    public render(): JSX.Element | null {
        const { moduleState, items, resource } = this.props;

        if (!items || !moduleState) {
            return null;
        }

        return (
            <div className='ms-checkout__guided-form'>
                {items.map((item: React.ReactNode) => {
                    const childId = this.getId(item);
                    const step = this.getStep(childId);
                    const title = this.getHeading(item);
                    const state = this.props.moduleState.getModule(childId);
                    const { isReady, isPending, isUpdating, isDisabled, onEdit, onCancel, onSubmit, hasModuleState, hasInitialized } =
                        state || ({} as IModuleStateManager);
                    return (
                        <GuidedCard
                            key={childId}
                            step={step}
                            title={title}
                            resource={resource}
                            disabled={!hasModuleState || isDisabled}
                            isActive={this.isActive(step)}
                            isVisted={this.isVisted(step)}
                            isExpanded={this.isExpanded(step)}
                            isSubmitting={isPending}
                            isMobile={this.props.isMobile}
                            isPending={isPending}
                            isUpdating={isUpdating}
                            hasInitialized={hasInitialized}
                            isReady={isReady}
                            onSubmit={onSubmit}
                            onCancel={onCancel}
                            onEdit={onEdit}
                            onNext={this.onNext}
                            hasControlGroup={!this.props.disableGuidedCheckoutFlow && hasInitialized}
                        >
                            {React.cloneElement(item as React.ReactElement, { enableControl: true })}
                        </GuidedCard>
                    );
                })}
            </div>
        );
    }

    private getEnabledModules = (): string[] => {
        const {
            moduleState: { childIds, getModule }
        } = this.props;
        return childIds.filter((childId: string) => {
            const state = getModule(childId);
            return !!state && !state.isDisabled;
        });
    };

    private getStep = (id: string): number => {
        return this.getEnabledModules().indexOf(id);
    };

    private getId = (item: React.ReactNode): string => {
        return get(item, 'props.id') || '';
    };

    private getHeading = (item: React.ReactNode): Heading => {
        return get(item, 'props.config.heading') || '';
    };

    private isExpanded = (step: number): boolean => {
        if (this.props.isEditor) {
            // Editorial mode: Expand all the drawers
            return true;
        }
        return step > -1 && step <= this.state.currentStep;
    };

    private isActive = (step: number): boolean => {
        return step === this.state.currentStep;
    };

    private isVisted = (step: number): boolean => {
        return step > -1 && step < this.state.currentStep;
    };

    private onNext = (): void => {
        this.setState({
            currentStep: this.state.currentStep + 1
        });
    };
}

export default CheckoutGuidedForm;
