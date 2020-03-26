import { mount, render } from 'enzyme';
import * as React from 'react';
import { IPickUpInStoreProps, PickUpInStore } from '../components/cart-clone-pick-up-in-store';

describe('Cart pick up in store', () => {

    it('renders correctly with a cartline which has already selected store', () => {

        const pickUpInStoreProps: IPickUpInStoreProps = {
            cartline: {
                LineId: '10',
                FulfillmentStoreId: '1'
            },
            // @ts-ignore
            product: {
                ItemId: '10',
                RecordId: 10
            },
            shipitText: 'Ship it',
            pickUpInStoreText: 'Select a store for pickup',
            changeStoreText: 'Change store',
            // @ts-ignore
            cartState:{
                cart:{
                    Id: '12345',
                    CartLines: [
                        {
                            LineId: '10',
                            FulfillmentStoreId: '1'
                        }
                    ]
                }
            },
            orgUnitLocations:[
                {
                    InventoryLocationId: '1',
                    OrgUnitName: 'Bellevue'
                }
            ]
        };

        const pickUpInStore = PickUpInStore(pickUpInStoreProps);
        const renderedComponent = render(<div>{pickUpInStore.defaultComponent}</div>);
        expect(renderedComponent).toMatchSnapshot();
    });

    it('renders correctly with a cartline which has already selected store but orgunitlocations is missing id', () => {

        const pickUpInStoreProps: IPickUpInStoreProps = {
            cartline: {
                LineId: '10',
                FulfillmentStoreId: 'Bellevue'
            },
            // @ts-ignore
            product: {
                ItemId: '10',
                RecordId: 10
            },
            shipitText: 'Ship it',
            pickUpInStoreText: 'Select a store for pickup',
            changeStoreText: 'Change store',
            // @ts-ignore
            cartState:{
                cart:{
                    Id: '12345',
                    CartLines: [
                        {
                            LineId: '10',
                            FulfillmentStoreId: '2'
                        }
                    ]
                }
            },
            orgUnitLocations:[
                {
                    InventoryLocationId: '1',
                    OrgUnitName: 'Bellevue'
                }
            ]
        };

        const pickUpInStore = PickUpInStore(pickUpInStoreProps);
        const renderedComponent = render(<div>{pickUpInStore.defaultComponent}</div>);
        expect(renderedComponent).toMatchSnapshot();
    });

    it('renders correctly with a cartline when no store is associated with it', () => {

        const pickUpInStoreProps: IPickUpInStoreProps = {
            cartline: {
                LineId: '10'
            },
            // @ts-ignore
            product: {
                ItemId: '10',
                RecordId: 10
            },
            shipitText: 'Ship it',
            pickUpInStoreText: 'Select a store for pickup',
            changeStoreText: 'Change store',
            // @ts-ignore
            cartState:{
                cart:{
                    Id: '12345',
                    CartLines: [
                        {
                            LineId: '10',
                            FulfillmentStoreId: '1'
                        }
                    ]
                }
            },
            orgUnitLocations:[
                {
                    InventoryLocationId: '1',
                    OrgUnitName: 'Bellevue'
                }
            ]
        };

        const pickUpInStore = PickUpInStore(pickUpInStoreProps);
        const renderedComponent = render(<div>{pickUpInStore.defaultComponent}</div>);
        expect(renderedComponent).toMatchSnapshot();
    });

    it('calls update cartline pickup on selection of bopis', () => {
        const spyUpdateCartLinePickupLocation = () => Promise.resolve({status: 'SUCCESS'});

        const pickUpInStoreProps: IPickUpInStoreProps = {
            cartline: {
                LineId: '10'
            },
            // @ts-ignore
            product: {
                ItemId: '10',
                RecordId: 10
            },
            shipitText: 'Ship it',
            pickUpInStoreText: 'Select a store for pickup',
            changeStoreText: 'Change store',
            // @ts-ignore
            storeSelectorStateManager: {
                openDialog: (input) => {
                    return input.onLocationSelected({
                        InventoryLocationId: '1',
                        OrgUnitName: 'Bellevue'
                    }).then(() => {
                        expect(spyUpdateCartLinePickupLocation).toHaveBeenCalled();
                    });
                }
            },
            // @ts-ignore
            cartState:{
                cart:{
                    Id: '12345',
                    CartLines: [
                        {
                            LineId: '10',
                            FulfillmentStoreId: '1'
                        }
                    ]
                },
                updateCartLinePickupLocation: spyUpdateCartLinePickupLocation
            },
            orgUnitLocations:[
                {
                    InventoryLocationId: '1',
                    OrgUnitName: 'Bellevue'
                }
            ]
        };

        const pickUpInStore = PickUpInStore(pickUpInStoreProps);
        const renderedComponent = mount(pickUpInStore.defaultComponent as React.ReactElement);
        renderedComponent.find('#ms-cart-bopis-pickup-option-10').simulate('change');
    });

    it('clears the previosly selected bopis on the cartline', () => {
        const spyClearCartLinePickupLocation = jest.fn().mockImplementation(() => Promise.resolve({}));

        const pickUpInStoreProps: IPickUpInStoreProps = {
            cartline: {
                LineId: '10',
                FulfillmentStoreId: '1'
            },
            // @ts-ignore
            product: {
                ItemId: '10',
                RecordId: 10
            },
            shipitText: 'Ship it',
            pickUpInStoreText: 'Select a store for pickup',
            changeStoreText: 'Change store',
            // @ts-ignore
            cartState:{
                cart:{
                    Id: '12345',
                    CartLines: [
                        {
                            LineId: '10',
                            FulfillmentStoreId: '1'
                        }
                    ]
                },
                clearCartLinePickupLocation: spyClearCartLinePickupLocation
            },
            orgUnitLocations:[
                {
                    InventoryLocationId: '1',
                    OrgUnitName: 'Bellevue'
                }
            ]
        };

        const pickUpInStore = PickUpInStore(pickUpInStoreProps);
        const renderedComponent = mount(pickUpInStore.defaultComponent as React.ReactElement);
        renderedComponent.find('#ms-cart-bopis-ship-option-10').simulate('change');
        expect(spyClearCartLinePickupLocation).toHaveBeenCalled();
    });
});