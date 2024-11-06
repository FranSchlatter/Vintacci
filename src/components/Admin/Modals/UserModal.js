import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { userSchema, formatZodErrors } from '../../../config/validationSchemas';
import FormInput from '../../common/FormInput';
import FormSelect from '../../common/FormSelect';

const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', role: 'user', first_name: '', last_name: '',
    dni: '', phone: '', birth_date: '', newsletter_subscription: false, preferences: {}
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const { password, ...userData } = user;
      setFormData({
        ...userData,
        birth_date: userData.birth_date ? userData.birth_date.split('T')[0] : ''
      });
    } else {
      setFormData({
        username: '', email: '', password: '', role: 'user', first_name: '', last_name: '',
        dni: '', phone: '', birth_date: '', newsletter_subscription: false, preferences: {}
      });
    }
    setErrors({});
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const validatedData = userSchema.parse(formData);
      onSave(validatedData);
    } catch (error) {
      setErrors(formatZodErrors(error));
    }
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: 'user', label: 'Usuario' },
    { value: 'staff', label: 'Staff' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full"><X size={24} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos de cuenta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} required />
              <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
              {!user && <FormInput label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required minLength={6} />}
              <FormSelect label="Rol" name="role" value={formData.role} onChange={handleChange} error={errors.role} options={roleOptions} required />
            </div>

            {/* Datos personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Nombre" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} required />
              <FormInput label="Apellido" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} required />
              <FormInput label="DNI" name="dni" value={formData.dni} onChange={handleChange} error={errors.dni} required />
              <FormInput label="Teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} required />
              <FormInput label="Fecha de Nacimiento" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} error={errors.birth_date} required />
              
              <div className="flex items-center">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input type="checkbox" name="newsletter_subscription" checked={formData.newsletter_subscription} onChange={handleChange} className="rounded text-blue-600 focus:ring-blue-500"/>
                  <span>Suscribirse al newsletter</span>
                </label>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {user ? 'Actualizar' : 'Crear'} Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;