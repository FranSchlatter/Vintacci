const initialState = {
    allProducts: [],
    currentProduct: null,
    loading: false,
    error: null,
    success: false,
    variantLoading: false,
    variantError: null
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch all products
        case 'FETCH_PRODUCTS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
        case 'FETCH_PRODUCTS_SUCCESS':
            return {
                ...state,
                allProducts: action.payload,
                loading: false,
                error: null,
                success: true
            };
        case 'FETCH_PRODUCTS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        // Fetch product by ID
        case 'FETCH_PRODUCT_BY_ID_REQUEST':
            return {
                ...state,
                currentProduct: null,
                loading: true,
                error: null
            };
        case 'FETCH_PRODUCT_BY_ID_SUCCESS':
            return {
                ...state,
                currentProduct: action.payload,
                loading: false,
                error: null
            };
        case 'FETCH_PRODUCT_BY_ID_FAILURE':
            return {
                ...state,
                currentProduct: null,
                loading: false,
                error: action.payload
            };

        // Add product
        case 'ADD_PRODUCT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
        case 'ADD_PRODUCT_SUCCESS':
            return {
                ...state,
                allProducts: [...state.allProducts, action.payload],
                loading: false,
                error: null,
                success: true
            };
        case 'ADD_PRODUCT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        // Update product
        case 'UPDATE_PRODUCT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
        case 'UPDATE_PRODUCT_SUCCESS':
            return {
                ...state,
                allProducts: state.allProducts.map(product =>
                    product.id === action.payload.id ? action.payload : product
                ),
                currentProduct: state.currentProduct?.id === action.payload.id ? 
                    action.payload : state.currentProduct,
                loading: false,
                error: null,
                success: true
            };
        case 'UPDATE_PRODUCT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        // Delete product
        case 'DELETE_PRODUCT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'DELETE_PRODUCT_SUCCESS':
            return {
                ...state,
                allProducts: state.allProducts.filter(product => product.id !== action.payload),
                loading: false,
                error: null,
                success: true
            };
        case 'DELETE_PRODUCT_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        // Variant actions
        case 'CREATE_VARIANT_REQUEST':
        case 'UPDATE_VARIANT_REQUEST':
        case 'DELETE_VARIANT_REQUEST':
            return {
                ...state,
                variantLoading: true,
                variantError: null
            };

        case 'CREATE_VARIANT_SUCCESS':
            return {
                ...state,
                allProducts: state.allProducts.map(product => 
                    product.id === action.payload.productId
                        ? {
                            ...product,
                            ProductVariants: [
                                ...(product.ProductVariants || []),
                                action.payload.variant
                            ]
                        }
                        : product
                ),
                currentProduct: state.currentProduct?.id === action.payload.productId
                    ? {
                        ...state.currentProduct,
                        ProductVariants: [
                            ...(state.currentProduct.ProductVariants || []),
                            action.payload.variant
                        ]
                    }
                    : state.currentProduct,
                variantLoading: false,
                variantError: null
            };

        case 'UPDATE_VARIANT_SUCCESS':
            return {
                ...state,
                allProducts: state.allProducts.map(product => 
                    product.id === action.payload.productId
                        ? {
                            ...product,
                            ProductVariants: (product.ProductVariants || []).map(variant =>
                                variant.id === action.payload.variantId
                                    ? action.payload.updatedVariant
                                    : variant
                            )
                        }
                        : product
                ),
                currentProduct: state.currentProduct?.id === action.payload.productId
                    ? {
                        ...state.currentProduct,
                        ProductVariants: (state.currentProduct.ProductVariants || []).map(variant =>
                            variant.id === action.payload.variantId
                                ? action.payload.updatedVariant
                                : variant
                        )
                    }
                    : state.currentProduct,
                variantLoading: false,
                variantError: null
            };

        case 'DELETE_VARIANT_SUCCESS':
            return {
                ...state,
                allProducts: state.allProducts.map(product => 
                    product.id === action.payload.productId
                        ? {
                            ...product,
                            ProductVariants: (product.ProductVariants || []).filter(
                                variant => variant.id !== action.payload.variantId
                            )
                        }
                        : product
                ),
                currentProduct: state.currentProduct?.id === action.payload.productId
                    ? {
                        ...state.currentProduct,
                        ProductVariants: (state.currentProduct.ProductVariants || []).filter(
                            variant => variant.id !== action.payload.variantId
                        )
                    }
                    : state.currentProduct,
                variantLoading: false,
                variantError: null
            };

        case 'CREATE_VARIANT_FAILURE':
        case 'UPDATE_VARIANT_FAILURE':
        case 'DELETE_VARIANT_FAILURE':
            return {
                ...state,
                variantLoading: false,
                variantError: action.payload
            };

        default:
            return state;
    }
};

export default productReducer;