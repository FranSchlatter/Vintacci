// src/components/Navbar/ActionIcons/index.js
import React from 'react';
import CartIcon from './CartIcon';
import UserMenu from './UserMenu';

const ActionIcons = () => (
  <div className="flex items-center space-x-6">
    <CartIcon />
    <UserMenu />
  </div>
);

export default ActionIcons;
