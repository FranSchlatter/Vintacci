// src/redux/actions/orderActions.js
import axios from 'axios';

export const fetchOrders = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5000/orders');
    dispatch({ type: 'FETCH_ORDERS', payload: response.data });
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

export const updateOrderStatus = (id, status) => async (dispatch) => {
  try {
    const response = await axios.patch(`http://localhost:5000/orders/${id}`, { status });
    dispatch({ type: 'UPDATE_ORDER', payload: response.data });
  } catch (error) {
    console.error('Error updating order:', error);
  }
};