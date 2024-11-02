// src/redux/reducers/authReducer.js
const initialState = {
    isAuthenticated: false,
    currentUser: null,
    loading: true,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                currentUser: action.payload,
                loading: false
            };

        case 'LOGIN_FAIL':
        case 'REGISTER_FAIL':
            return {
                ...state,
                isAuthenticated: false,
                currentUser: null,
                loading: false,
                error: action.payload
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