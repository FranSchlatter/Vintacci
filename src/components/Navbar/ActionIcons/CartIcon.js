// src/components/Navbar/ActionIcons/CartIcon.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCartIcon } from '@heroicons/react/outline';

const CartIcon = () => {
  const navigate = useNavigate();
  const cartItemCount = useSelector(state => 
    state.cart?.items.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0)
  );

  return (
    <button
      onClick={() => navigate('/cart')}
      className="relative text-gray-700 hover:text-gray-900"
    >
      <ShoppingCartIcon className="h-6 w-6" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {cartItemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;