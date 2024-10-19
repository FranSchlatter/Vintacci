// src/pages/AdminPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import AdminProductPanel from '../components/AdminProductPanel';
import AdminUserPanel from '../components/AdminUserPanel';

const AdminPage = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="admin-page">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <div className="flex justify-around">
                <AdminProductPanel /> {/* Panel para gestionar productos */}
                <AdminUserPanel /> {/* Panel para gestionar usuarios */}
            </div>
        </div>
    );
};

export default AdminPage;
