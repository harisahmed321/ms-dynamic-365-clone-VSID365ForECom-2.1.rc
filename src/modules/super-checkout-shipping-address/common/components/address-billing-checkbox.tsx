/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';
import AddressInputComponent from './address-input';

export interface IAddressBillingCheckbox {
    isChecked: boolean;
    value: string;
    ariaLabel: string;
    text: string;
    onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

const AddressBillingCheckbox: React.FC<IAddressBillingCheckbox> = ({
    isChecked,
    value,
    ariaLabel,
    text,
    onChange
}) => {

    const additionalAttributes = {
        checked: isChecked,
        'aria-checked': isChecked,
    };

    return (
        <label className='ms-checkout-billing-address__shipping-address-label'>
            <AddressInputComponent {...{ type: 'checkbox', className: 'ms-checkout-billing-address', value: value, onChange: onChange, additionalAddributes: additionalAttributes }} />
            <span className='ms-checkout-billing-address__shipping-address-checkbox-text'>
                {text}
            </span>
        </label>
    );
};

export default AddressBillingCheckbox;
