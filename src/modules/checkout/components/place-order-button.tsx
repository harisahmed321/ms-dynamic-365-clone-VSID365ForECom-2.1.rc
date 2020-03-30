/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/ //
import { Button } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import React, { useState } from 'react';

interface ICheckoutPlaceOrderButtonProps {
    canPlaceOrder: boolean;
    placeOrderText: string;
    placeOrder(): Promise<void>;
}

const CheckoutPlaceOrderButton: React.FC<ICheckoutPlaceOrderButtonProps> = ({ placeOrderText, canPlaceOrder, placeOrder }) => {
    const [isBusy, setIsBusy] = useState(false);
    const onPlaceOrder = async () => {
        if (isBusy || !canPlaceOrder) {
            return;
        }
        setIsBusy(true);
        await placeOrder();
        setIsBusy(false);
    };
    return (
        <Button
            className={classnames('ms-checkout__btn-place-order', { 'is-busy': isBusy })}
            color='primary'
            onClick={onPlaceOrder}
            disabled={!canPlaceOrder}
        >
            {placeOrderText}
        </Button>
    );
};

export default CheckoutPlaceOrderButton;
