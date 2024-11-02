// src/redux/reducers/addressReducer.js
const initialState = {
    addresses: [],
    loading: false,
    error: null
};

const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_USER_ADDRESSES':
            return {
                ...state,
                addresses: action.payload,
                loading: false
            };

        case 'ADD_ADDRESS':
            return {
                ...state,
                addresses: [...state.addresses, action.payload]
            };

        case 'UPDATE_ADDRESS':
            return {
                ...state,
                addresses: state.addresses.map(address =>
                    address.id === action.payload.id ? action.payload : address
                )
            };

        case 'DELETE_ADDRESS':
            return {
                ...state,
                addresses: state.addresses.filter(address => address.id !== action.payload)
            };

        case 'SET_DEFAULT_ADDRESS':
            return {
                ...state,
                addresses: state.addresses.map(address => ({
                    ...address,
                    is_default: address.id === action.payload.id
                }))
            };

        default:
            return state;
    }
};

export default addressReducer;