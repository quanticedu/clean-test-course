import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import Order from '.';
import OrderContext from '../../context/OrderContext';

describe('Test Order', () => {
  let orderName;
  let orderItems;
  beforeEach(() => {
    //Arrange:
    //Setup Order Context
    orderName = 'test-fun';
    orderItems = [
      { item: 'Test 1', quantity: 1 },
      { item: 'Test 2', quantity: 2 },
      { item: 'Test 3', quantity: 3 },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Test Delivery Fee', async () => {
    //Add a Test to verify that delivery fee shows up here
    //Act:
    //Setup the Mock API
    setupMock();
    //Call the page
    render(
      <OrderContext.Provider value={{ orderName, orderItems }}>
        <Order />
      </OrderContext.Provider>
    );
    //Assert: replace the return true.
    await waitFor(() => {
      return true;
    });
  });

  test('Test Update Delivery Fee', async () => {
    //Modify the delivery distance and verify that the delivery fee is updated
    //Act:
    //Setup the Mock API
    setupMock();
    //Call the page
    render(
      <OrderContext.Provider value={{ orderName, orderItems }}>
        <Order />
      </OrderContext.Provider>
    );

    //ACT
    //Update the Delivery distance by choosing the 5 mile option from the drop down
    userEvent.selectOptions(
      // Find the select element, like a real user would.
      screen.getByRole('combobox'),
      // Find and select the 5 mile option, like a real user would.
      screen.getByRole('option', { name: '5 miles' })
    );
    //Assert: replace the return true.
    await waitFor(() => {
      expect(screen.getAllByText('$5.00'))
        .toHaveLength(1);
    });
  });
});

const setupMock = () => {
  //Mock API calls
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockImplementation((url) => {
    switch (url) {
      case `${API_URL}/api/delivery/test-fun/0`:
        return Promise.resolve({
          data: {
            status: 'success',
            data: 2.5,
          },
        });
      case `${API_URL}/api/delivery/test-fun/5`:
        return Promise.resolve({
          data: {
            status: 'success',
            data: 5.0,
          },
        });
      default:
        return Promise.resolve({
          data: {
            status: 'fail',
          },
        });
    }
  });
};
