// src/components/Admin/AdminDashboard.js
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const products = useSelector(state => state.products.allProducts);
  const users = useSelector(state => state.users.allUsers);
  // Aquí agregaríamos más selectores cuando tengamos órdenes, etc.

  // Datos de ejemplo para los gráficos
  const salesData = [
    { name: 'Ene', ventas: 4000 },
    { name: 'Feb', ventas: 3000 },
    { name: 'Mar', ventas: 2000 },
    { name: 'Abr', ventas: 2780 },
    { name: 'May', ventas: 1890 },
    { name: 'Jun', ventas: 2390 },
  ];

  const statsCards = [
    {
      title: 'Total Productos',
      value: products?.length || 0,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Usuarios',
      value: users?.length || 0,
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Ventas del Mes',
      value: '$12,345',
      change: '-2%',
      changeType: 'negative'
    },
    {
      title: 'Pedidos Pendientes',
      value: '23',
      change: '+18%',
      changeType: 'positive'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
            <span className={`text-sm ${
              card.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
            }`}>
              {card.change} desde el último mes
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ventas" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Productos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;