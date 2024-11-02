import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, User, Calendar, Phone, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/actions/authActions';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '', 
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        dni: '',
        phone: '',
        birth_date: '',
        role: 'user', // Valor por defecto
        newsletter_subscription: false,
        status: 'active' // Valor por defecto
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        // Eliminar confirmPassword antes de enviar
        const userData = { ...formData };
        delete userData.confirmPassword;

        try {
            await dispatch(registerUser(userData));
            toast.success('¡Registro exitoso!');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error en el registro';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/">
                    <h1 className="text-center text-3xl font-bold text-gray-900">Vintacci</h1>
                </Link>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                    Crea tu cuenta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Inicia sesión
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Usuario */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre de usuario
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        username: e.target.value
                                    })}
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        first_name: e.target.value
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        last_name: e.target.value
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* DNI y Teléfono */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    DNI
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.dni}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            dni: e.target.value
                                        })}
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <CreditCard className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            phone: e.target.value
                                        })}
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                        </div>

                        {/* Fecha de nacimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Fecha de nacimiento
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        birth_date: e.target.value
                                    })}
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        email: e.target.value
                                    })}
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        {/* Contraseña y confirmación */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            password: e.target.value
                                        })}
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirmar Contraseña
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            confirmPassword: e.target.value
                                        })}
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                        </div>

                        {/* Newsletter subscription */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="newsletter"
                                checked={formData.newsletter_subscription}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    newsletter_subscription: e.target.checked
                                })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
                                Suscribirse al newsletter
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Registrarse
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;