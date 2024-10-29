import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings
} from 'lucide-react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminProductPanel from '../components/Admin/AdminProductPanel';
import AdminUserPanel from '../components/Admin/AdminUserPanel';
import AdminOrderPanel from '../components/Admin/AdminOrderPanel';
import AdminAnalytics from '../components/Admin/AdminAnalytics';
import AdminSettings from '../components/Admin/AdminSettings';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Productos', icon: <Package size={20} /> },
    { id: 'users', label: 'Usuarios', icon: <Users size={20} /> },
    { id: 'orders', label: 'Pedidos', icon: <ShoppingCart size={20} /> },
    { id: 'analytics', label: 'Análisis', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Configuración', icon: <Settings size={20} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProductPanel />;
      case 'users':
        return <AdminUserPanel />;
      case 'orders':
        return <AdminOrderPanel />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white min-h-screen shadow-lg">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-sm ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;