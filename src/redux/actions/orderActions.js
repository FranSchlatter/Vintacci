// src/redux/actions/orderActions.js
import axios from 'axios';

export const fetchOrders = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5000/orders');
    dispatch({ type: 'FETCH_ORDERS', payload: response.data });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createOrder = (orderData) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:5000/orders', orderData);
    dispatch({ type: 'CREATE_ORDER', payload: response.data });
    dispatch({ type: 'UPDATE_ANALYTICS', payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = (id, status) => async (dispatch) => {
  try {
    const response = await axios.patch(`http://localhost:5000/orders/${id}`, { status });
    dispatch({ type: 'UPDATE_ORDER', payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5000/orders/${id}`);
    dispatch({ type: 'DELETE_ORDER', payload: id });
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const getOrderDetails = (orderId) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/orders/${orderId}`);
    dispatch({ type: 'SET_ORDER_DETAILS', payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const generateInvoice = (orderId) => async (dispatch) => {
  try {
    const response = await axios.post(`http://localhost:5000/orders/${orderId}/invoice`);
    dispatch({ type: 'SET_ORDER_INVOICE', payload: { 
      orderId, 
      invoice: response.data 
    }});
    return response.data;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

