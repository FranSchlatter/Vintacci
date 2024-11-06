import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginUser } from '../redux/actions/authActions';
import { loginSchema, formatZodErrors } from '../config/validationSchemas';
import FormInput from '../components/common/FormInput';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', remember_me: false });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = loginSchema.parse(formData);
            await dispatch(loginUser(validatedData));
            toast.success('¡Bienvenido!');
            navigate('/');
        } catch (error) {
            if (error.errors) {
                setErrors(formatZodErrors(error));
            } else {
                toast.error(error.response?.data?.error || 'Error al iniciar sesión');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/"><h1 className="text-center text-3xl font-bold text-gray-900">Vintacci</h1></Link>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Inicia sesión en tu cuenta</h2>
                <p className="mt-2 text-center text-sm text-gray-600">¿No tienes una cuenta?{' '}<Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Regístrate</Link></p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required icon={<Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />
                        </div>

                        <div className="relative">
                            <FormInput label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required icon={<Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember_me" name="remember_me" checked={formData.remember_me} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Recordarme</label>
                            </div>
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</Link>
                            </div>
                        </div>

                        <button type="submit" className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" ><LogIn className="h-5 w-5 mr-2" />Iniciar Sesión</button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">O continúa con</span></div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" ><img className="h-5 w-5" src="/google.svg" alt="Google" /></button>
                            <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" ><img className="h-5 w-5" src="/facebook.svg" alt="Facebook" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;