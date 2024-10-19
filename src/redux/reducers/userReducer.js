const initialState = {
    users: [],
    loading: false,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_USERS_SUCCESS':
            return { ...state, users: action.payload, loading: false, error: null };
        case 'ADD_USER_SUCCESS':
            return { ...state, users: [...state.users, action.payload], loading: false, error: null };
        case 'UPDATE_USER_SUCCESS':
            return {
                ...state,
                users: state.users.map(user => user.id === action.payload.id ? action.payload : user),
                loading: false,
                error: null,
            };
        case 'DELETE_USER_SUCCESS':
            return { ...state, users: state.users.filter(user => user.id !== action.payload), loading: false, error: null };
        case 'FETCH_USERS_FAILURE':
        case 'ADD_USER_FAILURE':
        case 'UPDATE_USER_FAILURE':
        case 'DELETE_USER_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default userReducer;
