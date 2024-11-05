// src/redux/reducers/orderReducer.js
const initialState = {
  allOrders: [],
  currentOrder: null,
  loading: false,
  error: null
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ORDERS':
      return {
        ...state,
        allOrders: action.payload,
        loading: false
      };

    case 'CREATE_ORDER':
      return {
        ...state,
        allOrders: [...state.allOrders, action.payload],
        currentOrder: action.payload,
        loading: false
      };

    case 'UPDATE_ORDER':
      return {
        ...state,
        allOrders: state.allOrders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.id ? 
          action.payload : state.currentOrder
      };

    case 'DELETE_ORDER':
      return {
        ...state,
        allOrders: state.allOrders.filter(order => order.id !== action.payload)
      };

    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: action.payload,
        loading: false
      };

    case 'SET_ORDER_INVOICE':
      return {
        ...state,
        allOrders: state.allOrders.map(order =>
          order.id === action.payload.orderId ? 
          { ...order, invoice: action.payload.invoice } : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.orderId ?
          { ...state.currentOrder, invoice: action.payload.invoice } : 
          state.currentOrder
      };

    default:
      return state;
  }
};

export default orderReducer;