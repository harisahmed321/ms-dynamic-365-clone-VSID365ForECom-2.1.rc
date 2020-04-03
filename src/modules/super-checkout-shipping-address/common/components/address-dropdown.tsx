/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface IAdressDropdown {
    id: string;
    name: string;
    className: string;
    value: string;
    additionalAddributes?: object;
    displayData: { key?: string; value?: string }[];
    onChange(event: React.ChangeEvent<HTMLSelectElement>): void;
}

const getDropdownItem = (key?: string, value?: string, selectedValue?: string): React.ReactNode => {
    const isSelected = (key || '').toLowerCase() === (selectedValue || '').toLowerCase();

    return (
        <option key={key} value={key} aria-selected={isSelected}>
            {value}
        </option>
    );
};

const AdressDropdown: React.FC<IAdressDropdown> = ({
    id,
    name,
    className,
    value,
    additionalAddributes,
    displayData,
    onChange
}) => (
        <select
            id={id}
            className={`${className}__dropdown`}
            name={name}
            value={value}
            onChange={onChange}
            {...(additionalAddributes || {})}
        >
            {displayData && displayData.map(item =>
                (
                    getDropdownItem(item.key, item.value, value)
                ))
            }
        </select>
    );

export default AdressDropdown;
