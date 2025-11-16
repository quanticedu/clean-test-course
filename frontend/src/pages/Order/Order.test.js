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
    orderName = 'test-fun';
    orderItems = [
      { item: 'Test 1', quantity: 1 },
      { item: 'Test 2', quantity: 2 },
      { item: 'Test 3', quantity: 3 },
    ];

    //Mock API calls
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockImplementation((url) => {
      switch (url) {
        case `${API_URL}/api/delivery/test-fun/0`:
          return Promise.resolve({
            data: { status: 'success', data: 2.5 },
          });
        case `${API_URL}/api/delivery/test-fun/5`:
          return Promise.resolve({
            data: { status: 'success', data: 5.0 },
          });
        case `${API_URL}/api/subtotal/test-fun`:
          return Promise.resolve({
            data: { status: 'success', data: 5 },
          });
        case `${API_URL}/api/tax/test-fun/5`:
          return Promise.resolve({
            data: { status: 'success', data: 0.86 },
          });
        case `${API_URL}/api/total/test-fun/5`:
          return Promise.resolve({
            data: { status: 'success', data: 10.86 },
          });
        default:
          return Promise.resolve({ data: { status: 'fail' } });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Test Delivery Fee', async () => {
    setupMock();

    render(
      <OrderContext.Provider value={{ orderName, orderItems }}>
        <Order />
      </OrderContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('$2.50')).toHaveLength(1);
    });

    expect(screen.getAllByText('$5.00')).toHaveLength(1);
  });

  test('Test Update Delivery Fee', async () => {
    render(
      <OrderContext.Provider value={{ orderName, orderItems }}>
        <Order />
      </OrderContext.Provider>
    );

    userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: '5 miles' })
    );

    await waitFor(() => {
      expect(screen.getAllByText('$5.00')).toHaveLength(2);
    });

    expect(screen.getAllByText('$0.86')).toHaveLength(1);
    expect(screen.getAllByText('$10.86')).toHaveLength(1);
  });
});

const setupMock = () => {
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockImplementation((url) => {
    switch (url) {
      case `${API_URL}/api/delivery/test-fun/0`:
        return Promise.resolve({
          data: { status: 'success', data: 2.5 },
        });
      case `${API_URL}/api/delivery/test-fun/5`:
        return Promise.resolve({
          data: { status: 'success', data: 5.0 },
        });
      default:
        return Promise.resolve({
          data: { status: 'fail' },
        });
    }
  });
};
