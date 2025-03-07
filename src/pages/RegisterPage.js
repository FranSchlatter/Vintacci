import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, User, Calendar, Phone, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/actions/authActions';
import { registerSchema, formatZodErrors } from '../config/validationSchemas';
import FormInput from '../components/common/FormInput';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: '', first_name: '', last_name: '',
        dni: '', phone: '', birth_date: '', role: 'user', newsletter_subscription: false, status: 'active'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = registerSchema.parse(formData);
            const { confirmPassword, ...userData } = validatedData;
            await dispatch(registerUser(userData));
            toast.success('¡Registro exitoso!');
            navigate('/login');
        } catch (error) {
            if (error.errors) {
                setErrors(formatZodErrors(error));
            } else {
                toast.error(error.response?.data?.error || 'Error en el registro');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/"><h1 className="text-center text-3xl font-bold text-gray-900">Archivo Deportivo</h1></Link>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Crea tu cuenta</h2>
                <p className="mt-2 text-center text-sm text-gray-600">¿Ya tienes una cuenta?{' '}<Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Inicia sesión</Link></p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <FormInput label="Nombre de usuario" name="username" value={formData.username} onChange={handleChange} error={errors.username} required icon={<User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Nombre" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} required />
                            <FormInput label="Apellido" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="DNI" name="dni" value={formData.dni} onChange={handleChange} error={errors.dni} required icon={<CreditCard className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />
                            <FormInput label="Teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} icon={<Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />
                        </div>

                        <FormInput label="Fecha de nacimiento" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} error={errors.birth_date} required icon={<Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />

                        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required icon={<Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required icon={<Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />
                            <FormInput label="Confirmar Contraseña" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required icon={<Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />} className="pl-10" />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="newsletter" checked={formData.newsletter_subscription} onChange={handleChange} name="newsletter_subscription" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">Suscribirse al newsletter</label>
                        </div>

                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Registrarse</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;