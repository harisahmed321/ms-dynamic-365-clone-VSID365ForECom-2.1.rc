/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';

import { IProductFeatureData } from './product-feature.data';
import { IProductFeatureProps, imageAlignment } from './product-feature.props.autogenerated';

export interface IProductFeatureViewProps extends IProductFeatureProps<IProductFeatureData> {
    productName: string;
    productInfo: string;
    productImageUrl: string;
    productPrice: string;
    buttonInfo: string;
    alignment: imageAlignment;
    textColor: string;
    btnClickMe: any;
}

/**
 *
 * ProductFeature component
 * @extends {React.PureComponent<IProductFeatureProps<IProductFeatureData>>}
 */
class ProductFeature extends React.PureComponent<IProductFeatureProps<IProductFeatureData>> {
    public onBtnClickMe = () => {
        const product = this.props.data.product;
        console.log('button event click', product);
    };

    public render(): JSX.Element | null {
        console.log(this.props);
        const { config } = this.props;
        const { user } = this.props.context.request;
        console.log(user);
        if (!user.isAuthenticated && user.signInUrl && window) {
            window.location.assign(user.signInUrl);
        } else {
            console.log('user is authenticated');
        }

        // set default product info values
        const ProductName = config.productTitle ? config.productTitle : 'No product name defined';
        const ProductInfo = config.productDetails ? config.productDetails.toString() : 'No product details defined';
        const ProductImageUrl = config.productImage ? config.productImage.src : '';
        const ButtonInfo = config.buttonText ? config.buttonText : 'No button text defined';
        const ProductPrice = '129';

        const ProductFeatureViewProps = {
            ...this.props,
            productName: ProductName,
            productInfo: ProductInfo,
            productImageUrl: ProductImageUrl,
            productPrice: ProductPrice,
            buttonInfo: ButtonInfo,
            alignment: config.imageAlignment,
            textColor: config.textColor,
            btnClickMe: this.onBtnClickMe
        };
        // console.log('isAuthenticated', this.props.context.actionContext.requestContext.user.isAuthenticated);
        return this.props.renderView(ProductFeatureViewProps);
    }
}

export default ProductFeature;
