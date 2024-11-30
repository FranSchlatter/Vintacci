// src/redux/reducers/tagReducer.js
const initialState = {
    tags: [],
    loading: false,
    error: null,
    success: false
};

const tagReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_TAGS_REQUEST':
        case 'ADD_TAG_REQUEST':
        case 'UPDATE_TAG_REQUEST':
        case 'DELETE_TAG_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
        
        case 'FETCH_TAGS_SUCCESS':
            return {
                ...state,
                tags: action.payload,
                loading: false,
                error: null,
                success: true
            };

        case 'ADD_TAG_SUCCESS':
            return {
                ...state,
                tags: [...state.tags, action.payload],
                loading: false,
                error: null,
                success: true
            };

        case 'UPDATE_TAG_SUCCESS':
            return {
                ...state,
                tags: state.tags.map(tag =>
                    tag.id === action.payload.id ? action.payload : tag
                ),
                loading: false,
                error: null,
                success: true
            };

        case 'DELETE_TAG_SUCCESS':
            return {
                ...state,
                tags: state.tags.filter(tag => tag.id !== action.payload),
                loading: false,
                error: null,
                success: true
            };

        case 'FETCH_TAGS_FAILURE':
        case 'ADD_TAG_FAILURE':
        case 'UPDATE_TAG_FAILURE':
        case 'DELETE_TAG_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        default:
            return state;
    }
};

export default tagReducer;
