import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { contactSchema, formatZodErrors } from '../config/validationSchemas';
import FormInput from '../components/common/FormInput';
import FormTextArea from '../components/common/FormTextArea';
import { toast } from 'react-toastify';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const validatedData = contactSchema.parse(formData);
      
      await Promise.all([
        axios.post('http://localhost:5000/email/contact-confirm', validatedData),
        axios.post('http://localhost:5000/email/contact-staff', validatedData)
      ]);

      toast.success('Mensaje enviado correctamente');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Error:', error);
      if (error.name === 'ZodError') {
        setErrors(formatZodErrors(error));
        toast.error('Por favor, corrige los errores en el formulario');
      } else {
        toast.error('Error al enviar el mensaje. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <MapPin size={24} />, title: 'Ubicación', details: ['123 Calle Principal', 'Ciudad, CP 12345'] },
    { icon: <Phone size={24} />, title: 'Teléfono', details: ['+54 (11) 1234-5678', '+54 (11) 8765-4321'] },
    { icon: <Mail size={24} />, title: 'Email', details: ['info@vintacci.com', 'soporte@vintacci.com'] },
    { icon: <Clock size={24} />, title: 'Horario', details: ['Lunes a Viernes: 9:00 - 20:00', 'Sábados: 10:00 - 15:00'] }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contacto</h1>
          <p className="text-xl max-w-3xl mx-auto">Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre nuestros productos o servicios.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.title} className="flex items-start">
                  <div className="text-blue-600 mt-1">{info.icon}</div>
                  <div className="ml-4">
                    <h3 className="font-bold">{info.title}</h3>
                    {info.details.map((detail, index) => (
                      <p key={index} className="text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
              </div>
              <FormInput label="Asunto" name="subject" value={formData.subject} onChange={handleChange} error={errors.subject} required />
              <FormTextArea label="Mensaje" name="message" value={formData.message} onChange={handleChange} error={errors.message} required rows={5} />
              <button type="submit" disabled={loading} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">{loading ? 'Enviando...' : 'Enviar Mensaje'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;