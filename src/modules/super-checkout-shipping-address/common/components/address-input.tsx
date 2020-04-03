/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface IAdressInput {
    id?: string;
    name?: string;
    className: string;
    type: string;
    value: string;
    maxLength?: number;
    additionalAddributes?: object;
    onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

const AdressInput: React.FC<IAdressInput> = ({
    id,
    name,
    className,
    type,
    value,
    maxLength,
    additionalAddributes,
    onChange
}) => (
        <input
            name={name}
            id={id}
            className={`${className}__input ${className}__input-${type}`}
            type={type}
            value={value}
            maxLength={maxLength}
            {...(additionalAddributes || {})}
            onChange={onChange}
        />
    );

export default AdressInput;
