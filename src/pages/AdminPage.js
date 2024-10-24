import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import AdminProductPanel from '../components/AdminProductPanel';
import AdminUserPanel from '../components/AdminUserPanel';

const AdminPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="admin-page container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Panel de Administración</h1>
            <div className="flex justify-around flex-wrap">
                <AdminProductPanel /> {/* Panel para gestionar productos */}
                <AdminUserPanel /> {/* Panel para gestionar usuarios */}
            </div>
        </div>
    );
};

export default AdminPage;
