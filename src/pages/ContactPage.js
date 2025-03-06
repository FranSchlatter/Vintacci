import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock, Instagram, Twitter, Facebook, MessageCircle } from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const id = section.id;
        
        if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
          setIsVisible(prev => ({ ...prev, [id]: true }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { icon: <Mail size={32} />, title: 'Email', details: ['info@archivodepordivo.com'] },
    { icon: <Phone size={32} />, title: 'Teléfono', details: ['+5493424365585'] },
    { icon: <MessageCircle size={32} />, title: 'WhatsApp', details: ['+5493424365585'], isWhatsApp: true },
    { icon: <Clock size={32} />, title: 'Horario de Atención', details: ['Lunes a Viernes: 9:00 - 20:00'] }
  ];

  const socialMedia = [
    { icon: <Instagram size={20} />, name: 'Instagram', url: 'https://www.instagram.com/archivo_deportivo/', color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500' },
    { icon: <Twitter size={20} />, name: 'Twitter', url: 'https://twitter.com/archivodeportivo', color: 'bg-blue-400' },
    { icon: <Facebook size={20} />, name: 'Facebook', url: 'https://facebook.com/archivodeportivo', color: 'bg-blue-600' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="relative py-28 bg-gradient-to-r from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/soccer-jersey-mockup_23-2149959541.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Contáctanos</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Estamos a tu disposición para resolver cualquier consulta, gestionar pedidos personalizados
            y asesorarte sobre nuestras camisetas de calidad original.
          </p>
        </div>
      </div>

      {/* Contact Info & Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-on-scroll"
            id="contact-section"
            style={{ 
              opacity: isVisible['contact-section'] ? 1 : 0,
              transform: isVisible['contact-section'] ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
          >
            {/* Contact Info Column */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-8 relative inline-block">
                Información de Contacto
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></span>
              </h2>
              
              <div className="space-y-8 mb-12">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start group">
                    <div className="bg-red-500 text-white p-3 rounded-lg group-hover:bg-red-600 transition-colors duration-300">
                      {info.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg">{info.title}</h3>
                      {info.details.map((detail, index) => (
                        <p key={index} className="text-gray-600 mt-1">
                          {info.isWhatsApp ? (
                            <a 
                              href={`https://wa.me/${detail.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-red-500 transition-colors duration-300"
                            >
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Social Media */}
              <h3 className="text-2xl font-bold mb-6 relative inline-block">
                Síguenos
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></span>
              </h3>
              <div className="flex space-x-4 mb-12">
                {socialMedia.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              
              {/* Map placeholder */}
              <div className="rounded-lg overflow-hidden shadow-xl h-64 mb-6">
                {/* Google Maps Embed */}
                <div className="rounded-lg overflow-hidden shadow-xl h-64 mb-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1698.1631913916247!2d-60.71065152121207!3d-31.652289189779022!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b5a9a60234c3e3%3A0xfcb880ed7653dd65!2sSan%20Jer%C3%B3nimo%20S%2FN!5e0!3m2!1ses!2sar!4v1741285097649!5m2!1ses!2sar"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación referencial"
                  ></iframe>
                </div>
                <p className="text-sm text-gray-500">
                  Nota: Trabajamos únicamente de forma online. La ubicación es referencial.
                </p>

              </div>
              <p className="text-sm text-gray-500">Nota: Trabajamos únicamente de forma online. La ubicación es referencial.</p>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-xl border-t-4 border-red-500">
              <h2 className="text-3xl font-bold mb-8 relative inline-block">
                Envíanos un Mensaje
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></span>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="Nombre Completo" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    error={errors.name} 
                    required 
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <FormInput 
                    label="Email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    error={errors.email} 
                    required 
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <FormInput 
                  label="Asunto" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  error={errors.subject} 
                  required 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                
                <FormTextArea 
                  label="Mensaje" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  error={errors.message} 
                  required 
                  rows={5} 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 hover:shadow-red-500/30 hover:-translate-y-1"
                >
                  {loading ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section - Quick access to common questions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div 
            className="text-center mb-12 animate-on-scroll"
            id="faq-heading"
            style={{ 
              opacity: isVisible['faq-heading'] ? 1 : 0,
              transform: isVisible['faq-heading'] ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
          >
            <h2 className="text-4xl font-bold mb-6 relative inline-block">
              Preguntas Frecuentes
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Consulta algunas de las preguntas más comunes o contáctanos directamente para información específica sobre tu pedido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                question: "¿Cómo realizo un pedido?", 
                answer: "Por el momento, los pedidos se realizan únicamente por mensaje directo. Escríbenos con el modelo, talle y personalización que deseas." 
              },
              { 
                question: "¿Cuánto tarda en llegar mi pedido?", 
                answer: "El tiempo de entrega estimado es de 20 a 40 días hábiles, ya que cada camiseta se fabrica a pedido." 
              },
              { 
                question: "¿Realizan envíos a todo el país?", 
                answer: "Sí, enviamos a todo el país con seguimiento. Te mantendremos informado sobre el estado de tu pedido." 
              },
              { 
                question: "¿Qué métodos de pago aceptan?", 
                answer: "Aceptamos transferencias bancarias, Mercado Pago y efectivo. Al realizar tu pedido te informaremos todas las opciones disponibles." 
              },
              { 
                question: "¿Las camisetas son originales?", 
                answer: "Nuestras camisetas tienen calidad original, fabricadas con los mismos materiales y tecnologías que las versiones oficiales." 
              },
              { 
                question: "¿Puedo personalizar mi camiseta?", 
                answer: "¡Absolutamente! Puedes elegir número, nombre y parches oficiales para personalizar tu camiseta según tus preferencias." 
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-500 hover:shadow-xl transition-all duration-300 animate-on-scroll"
                id={`faq-item-${index}`}
                style={{ 
                  opacity: isVisible[`faq-item-${index}`] ? 1 : 0,
                  transform: isVisible[`faq-item-${index}`] ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`
                }}
              >
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div 
          className="container mx-auto px-4 text-center animate-on-scroll"
          id="cta-section"
          style={{ 
            opacity: isVisible['cta-section'] ? 1 : 0,
            transform: isVisible['cta-section'] ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}
        >
          <h2 className="text-4xl font-bold mb-6">¿Listo para unirte a nuestra comunidad?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Síguenos en redes sociales para descubrir nuevos lanzamientos, ofertas exclusivas y contenido especial.
          </p>
          
          <div className="flex justify-center space-x-4">
            {socialMedia.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-red-600 p-4 rounded-full hover:bg-gray-100 transition-all duration-300 hover:-translate-y-2"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
          
          <div className="mt-10 inline-block">
            <a 
              href="https://wa.me/5493424365585"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition-colors duration-300 shadow-xl hover:shadow-green-500/30 flex items-center justify-center space-x-2 mx-auto"
            >
              <MessageCircle size={20} />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;