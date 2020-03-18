/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buildMockModuleProps} from '@msdyn365-commerce/core-internal';
/// <reference types="jest" />

// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import * as renderer from 'react-test-renderer';

import ProductFeatureDetail from '../product-feature-detail';
import { IProductFeatureDetailData } from '../product-feature-detail.data';
import {
  IProductFeatureDetailConfig,
  IProductFeatureDetailProps
} from '../product-feature-detail.props.autogenerated';

const mockData: IProductFeatureDetailData = {
  actionResponse: {
    text: 'Sample Response Data'
  }
};

const mockConfig: IProductFeatureDetailConfig = {
  showText: 'product-feature-detail'
};

const mockActions = {};

describe('ProductFeatureDetail', () => {
  let moduleProps: IProductFeatureDetailProps<IProductFeatureDetailData>;
  beforeAll(() => {
    moduleProps = buildMockModuleProps(mockData, mockActions, mockConfig) as IProductFeatureDetailProps<IProductFeatureDetailData>;
  });
  it('renders correctly', () => {
    const component: renderer.ReactTestRenderer = renderer.create(
      <ProductFeatureDetail {...moduleProps} />
    );
    const tree: renderer.ReactTestRendererJSON | null = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
