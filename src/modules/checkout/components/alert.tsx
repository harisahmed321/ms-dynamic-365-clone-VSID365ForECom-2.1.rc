/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

interface IAlertProps {
    message: string;
}

const CheckoutAlert: React.FC<IAlertProps> = ({ message }) => (
    <p className='ms-checkout__error-message' role='alert' aria-live='assertive'>
        {message}
    </p>
);

export default CheckoutAlert;
