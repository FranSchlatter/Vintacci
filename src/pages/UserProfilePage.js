import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    MapPin, 
    ShoppingBag, 
    Heart, 
    Settings,
    Loader 
} from 'lucide-react';
import { checkAuth } from '../redux/actions/authActions';
import PersonalInfo from '../components/UserProfile/PersonalInfo';
import UserAddresses from '../components/UserProfile/UserAddresses';
import UserOrders from '../components/UserProfile/UserOrders';
import Wishlist from '../components/UserProfile/Wishlist';
import AccountSettings from '../components/UserProfile/AccountSettings';

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, loading } = useSelector(state => state.auth);

    // Verificar autenticación cuando se monta el componente
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // Redirigir si no está autenticado y no está cargando
    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    const tabs = [
        { id: 'personal', label: 'Datos Personales', icon: User },
        { id: 'addresses', label: 'Mis Direcciones', icon: MapPin },
        { id: 'orders', label: 'Mis Pedidos', icon: ShoppingBag },
        { id: 'wishlist', label: 'Lista de Deseos', icon: Heart },
        { id: 'settings', label: 'Configuración', icon: Settings }
    ];

    const renderContent = () => {
        switch(activeTab) {
            case 'personal':
                return <PersonalInfo user={currentUser} />;
            case 'addresses':
                return <UserAddresses userId={currentUser?.id} />;
            case 'orders':
                return <UserOrders userId={currentUser?.id} />;
            case 'wishlist':
                return <Wishlist userId={currentUser?.id} />;
            case 'settings':
                return <AccountSettings user={currentUser} />;
            default:
                return <PersonalInfo user={currentUser} />;
        }
    };

    // Mostrar loader mientras se verifica la autenticación
    if (loading || !currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="md:w-1/4">
                    <div className="bg-white rounded-lg shadow p-4">
                        {/* Usuario */}
                        <div className="flex items-center space-x-4 mb-6 p-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                {currentUser.first_name?.[0]}{currentUser.last_name?.[0]}
                            </div>
                            <div>
                                <h2 className="font-semibold">
                                    {currentUser.first_name} {currentUser.last_name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {currentUser.email}
                                </p>
                            </div>
                        </div>

                        {/* Navegación */}
                        <nav className="space-y-2">
                            {tabs.map(tab => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                                            ${activeTab === tab.id 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <TabIcon size={20} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="md:w-3/4">
                    <div className="bg-white rounded-lg shadow p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;