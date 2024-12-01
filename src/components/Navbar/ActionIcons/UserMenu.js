// src/components/Navbar/ActionIcons/UserMenu.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon } from '@heroicons/react/outline';
import { logoutUser } from '../../../redux/actions/authActions';
import UserMenuDropdown from './UserMenuDropdown';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { isAuthenticated, currentUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <UserIcon className="h-6 w-6" />
      </button>
      {isOpen && (
        <UserMenuDropdown 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;