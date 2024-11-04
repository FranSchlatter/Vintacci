// src/redux/reducers/authReducer.js
const initialState = {
    isAuthenticated: false,
    currentUser: null,
    loading: true
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
        case 'UPDATE_CURRENT_USER':
            return {
                ...state,
                isAuthenticated: true,
                currentUser: action.payload,
                loading: false
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                currentUser: null,
                loading: false
            };
        default:
            return state;
    }
};

export default authReducer;