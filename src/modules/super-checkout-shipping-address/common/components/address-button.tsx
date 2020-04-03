/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface IAddressButton {
    className: string;
    text: string;
    ariaLabel: string;
    disabled?: boolean;
    onClick(event: React.MouseEvent<HTMLElement>): void;
}

const AddressButton: React.FC<IAddressButton> = ({ className, text, ariaLabel, disabled, onClick }) => (
    <button
        className={className}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
    >
        {text}
    </button>
);

export default AddressButton;
