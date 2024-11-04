// src/pages/.js
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: 'Ubicación',
      details: ['123 Calle Principal', 'Ciudad, CP 12345']
    },
    {
      icon: <Phone size={24} />,
      title: 'Teléfono',
      details: ['+54 (11) 1234-5678', '+54 (11) 8765-4321']
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      details: ['info@vintacci.com', 'soporte@vintacci.com']
    },
    {
      icon: <Clock size={24} />,
      title: 'Horario',
      details: ['Lunes a Viernes: 9:00 - 20:00', 'Sábados: 10:00 - 15:00']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contacto</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre 
            nuestros productos o servicios.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Información de Contacto */}
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

          {/* Formulario de Contacto */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="subject">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="message">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;