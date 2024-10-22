// src/redux/actions/cartActions.js
export const addToCart = (product) => ({
    type: 'ADD_TO_CART',
    payload: product,
});

export const removeFromCart = (id) => ({
    type: 'REMOVE_FROM_CART',
    payload: { id },
});

export const updateQuantity = (id, quantity) => ({
    type: 'UPDATE_QUANTITY',
    payload: { id, quantity },
});

export const clearCart = () => ({
    type: 'CLEAR_CART',
});
