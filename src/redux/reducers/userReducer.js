const initialState = {
    allUsers: [],
    loading: false,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_USERS':
            return { ...state, allUsers: action.payload, loading: false, error: null };
        case 'ADD_USER':
            return { ...state, allUsers: [...state.allUsers, action.payload], loading: false, error: null };
        case 'UPDATE_USER':
            return {
                ...state,
                allUsers: state.allUsers.map(user => user.id === action.payload.id ? action.payload : user),
                loading: false,
                error: null,
            };
        case 'DELETE_USER':
            return { ...state, allUsers: state.allUsers.filter(user => user.id !== action.payload), loading: false, error: null };
        case 'FETCH_USER_ID':
            return {
                ...state,
                selectedUser: action.payload,
                loading: false
            };
        default:
            return state;
    }
};

export default userReducer;
