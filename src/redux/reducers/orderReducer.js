// src/redux/reducers/orderReducer.js
const initialState = {
    allOrders: [],
    loading: false,
    error: null
  };
  
  export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_ORDERS':
        return {
          ...state,
          allOrders: action.payload,
          loading: false
        };
      case 'UPDATE_ORDER':
        return {
          ...state,
          allOrders: state.allOrders.map(order =>
            order.id === action.payload.id ? action.payload : order
          )
        };
      default:
        return state;
    }
  };