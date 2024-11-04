// src/redux/reducers/favoriteReducer.js
const initialState = {
    items: [],
    loading: false,
    error: null
};

const favoriteReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_FAVORITES':
            return {
                ...state,
                items: action.payload,
                loading: false
            };
        case 'ADD_TO_FAVORITES':
            const newFavorite = {
                id: action.payload.id,
                product_id: action.payload.product_id,
                user_id: action.payload.user_id,
                ...action.payload.product
            };
            return {
                ...state,
                items: [...state.items, newFavorite]
            };
        case 'REMOVE_FROM_FAVORITES':
            return {
                ...state,
                items: state.items.filter(item => item.product_id !== action.payload)
            };
        default:
            return state;
    }
};

export default favoriteReducer;