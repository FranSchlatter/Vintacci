import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Lock, Bell, AlertTriangle, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { updateUser, deleteUser } from '../../redux/actions/userActions';
import { passwordChangeSchema, deleteAccountSchema, formatZodErrors } from '../../config/validationSchemas';
import FormInput from '../common/FormInput';

const AccountSettings = ({ user }) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('security');
    const [errors, setErrors] = useState({});
    
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: true,
        newsletter: true,
        newProducts: false
    });

    const [deleteAccount, setDeleteAccount] = useState({
        confirmDelete: false,
        password: ''
    });

    useEffect(() => {
        if (user.notification_preferences) {
            setNotifications(user.notification_preferences);
        }
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const validatedData = passwordChangeSchema.parse(passwordForm);
            await dispatch(updateUser(user.id, { 
                password: validatedData.newPassword,
                currentPassword: validatedData.currentPassword 
            }));
            toast.success('Contraseña actualizada correctamente');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setErrors({});
        } catch (error) {
            if (error.errors) {
                setErrors(formatZodErrors(error));
            } else {
                toast.error('Error al actualizar la contraseña');
            }
        }
    };

    const handleNotificationChange = async (setting) => {
        const newPreferences = { ...notifications, [setting]: !notifications[setting] };
        try {
            await dispatch(updateUser(user.id, { notification_preferences: newPreferences }));
            setNotifications(newPreferences);
            toast.success('Preferencias actualizadas');
        } catch (error) {
            toast.error('Error al actualizar las preferencias');
            setNotifications(notifications);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const validatedData = deleteAccountSchema.parse(deleteAccount);
            if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
                await dispatch(deleteUser(user.id, { password: validatedData.password }));
                toast.success('Cuenta eliminada correctamente');
            }
        } catch (error) {
            if (error.errors) {
                setErrors(formatZodErrors(error));
            } else {
                toast.error('Error al eliminar la cuenta');
            }
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'security':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <FormInput label="Contraseña Actual" type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} error={errors.currentPassword} required />
                            <FormInput label="Nueva Contraseña" type="password" name="newPassword" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} error={errors.newPassword} required />
                            <FormInput label="Confirmar Nueva Contraseña" type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} error={errors.confirmPassword} required />
                            <button type="submit" className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" ><Save className="w-4 h-4 mr-2" />Actualizar Contraseña</button>
                        </form>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium">Preferencias de Notificación</h3>
                        <div className="space-y-4">
                            {Object.entries({
                                orderUpdates: 'Actualizaciones de pedidos',
                                promotions: 'Ofertas y promociones',
                                newsletter: 'Newsletter mensual',
                                newProducts: 'Nuevos productos'
                            }).map(([key, label]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="text-gray-700">{label}</span>
                                    <button onClick={() => handleNotificationChange(key)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications[key] ? 'bg-blue-600' : 'bg-gray-200'}`} >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'delete':
                return (
                    <div className="space-y-6">
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Eliminar Cuenta</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>Esta acción es irreversible. Se eliminarán todos tus datos, incluyendo:</p>
                                        <ul className="list-disc list-inside mt-2">
                                            <li>Historial de pedidos</li>
                                            <li>Información personal</li>
                                            <li>Direcciones guardadas</li>
                                            <li>Lista de deseos</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                            <FormInput label="Contraseña" type="password" name="password" value={deleteAccount.password} onChange={(e) => setDeleteAccount(prev => ({ ...prev, password: e.target.value }))} error={errors.password} required />
                            
                            <div className="flex items-start">
                                <input type="checkbox" checked={deleteAccount.confirmDelete} onChange={(e) => setDeleteAccount(prev => ({ ...prev, confirmDelete: e.target.checked }))} className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                <label className="ml-2 block text-sm text-gray-700">Confirmo que quiero eliminar mi cuenta permanentemente</label>
                            </div>
                            {errors.confirmDelete && <p className="text-sm text-red-500">{errors.confirmDelete}</p>}

                            <button type="submit" className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >Eliminar Cuenta</button>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configuración de la Cuenta</h2>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'security', label: 'Seguridad', icon: Lock },
                        { id: 'notifications', label: 'Notificaciones', icon: Bell },
                        { id: 'delete', label: 'Eliminar Cuenta', icon: AlertTriangle }
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
                                <Icon className="w-5 h-5 mr-2" />{tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-6">{renderTabContent()}</div>
        </div>
    );
};

export default AccountSettings;