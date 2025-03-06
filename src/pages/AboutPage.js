// src/pages/AboutPage.js
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Shirt, Package, CreditCard, Sparkles, HandCoins } from 'lucide-react';

const AboutPage = () => {
  const [openFaqId, setOpenFaqId] = useState(null);
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

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const features = [
    {
      id: 'feature-1',
      icon: <Shirt size={32} />,
      title: 'Calidad Original',
      description: 'Camisetas importadas, confeccionadas con materiales oficiales como Dri-FIT, Aeroready y Climachill. Diseñadas para ofrecer la misma calidad que las prendas oficiales.'
    },
    {
      id: 'feature-2',
      icon: <Sparkles size={32} />,
      title: 'Personalización Total',
      description: 'Elegí la versión, el talle (XS a XXXL), dorsal, tipografía y parches oficiales. Cada prenda es única, hecha a medida para vos.'
    },
    {
      id: 'feature-3',
      icon: <Package size={32} />,
      title: '+10K Productos Disponibles',
      description: 'Selección única de camisetas actuales, retro y vintage. Camisetas emblemáticas, ediciones especiales y limitadas.'
    },
    {
      id: 'feature-4',
      icon: <HandCoins size={32} />,
      title: 'Compra Directa a Fabricantes',
      description: 'Trabajamos con fabricantes internacionales para garantizar camisetas de calidad original al mejor precio posible.'
    },
    {
      id: 'feature-5',
      icon: <ShieldCheck size={32} />,
      title: 'Control de Calidad',
      description: 'Cada prenda pasa por un estricto control de calidad antes del envío, garantizando los más altos estándares.'
    },
    {
      id: 'feature-6',
      icon: <CreditCard size={32} />,
      title: 'Precios Justos',
      description: 'Al trabajar sin intermediarios, ofrecemos camisetas con los mismos materiales y detalles de las oficiales, a un precio más accesible.'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: '¿Las camisetas son originales?',
      answer: 'Nuestras camisetas tienen calidad original, fabricadas con los mismos materiales, detalles y tecnología que las versiones oficiales. Son prendas diseñadas con el más alto nivel de confección, garantizando que cada pieza cumpla con los estándares de los jugadores y fanáticos más exigentes.'
    },
    {
      id: 2,
      question: '¿Cómo hago un pedido?',
      answer: 'Por el momento, los pedidos se realizan únicamente por MD. Escribinos con el modelo, talle, dorsal y parches que querés, y te pasamos los detalles para confirmar la compra.'
    },
    {
      id: 3,
      question: '¿Por qué tardan en llegar?',
      answer: 'No trabajamos con stock. Cada camiseta se fabrica, personaliza e importa bajo pedido, lo que implica tiempos de confección, despacho y envío. Este proceso nos permite garantizar calidad y exclusividad. Tiene una demora de entre 20 y 40 dias habiles.'
    },
    {
      id: 4,
      question: '¿Hacen envíos a todo el país?',
      answer: 'Sí, enviamos a todo el país con seguimiento. Además, te informamos cada etapa del proceso para que sepas exactamente en qué estado está tu pedido.'
    },
    {
      id: 5,
      question: '¿Son idénticas a las originales?',
      answer: 'Sí, las camisetas tienen el mismo corte, costuras, escudos bordados y materiales que las vendidas en tiendas oficiales. Son prácticamente indistinguibles en diseño y sensación al tacto.'
    },
    {
      id: 6,
      question: '¿Qué pasa si la camiseta tiene un defecto?',
      answer: 'Antes de ser enviadas, cada prenda pasa por un estricto control de calidad, pero si hubiera algún inconveniente, ofrecemos cambio o reembolso.'
    },
    {
      id: 7,
      question: '¿Las camisetas están en stock?',
      answer: 'No, cada prenda se fabrica e importa a pedido. Así garantizamos que tengas la camiseta exacta que querés sin depender de un stock limitado.'
    },
    {
      id: 8,
      question: '¿Vale la pena esperar?',
      answer: 'Definitivamente. La diferencia entre comprar una camiseta genérica y recibir una hecha a medida con los detalles exactos que querés es lo que nos hace únicos.'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="relative py-28 bg-gradient-to-r from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/football-jersey-concept_23-2149492851.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Archivo Deportivo</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Más que una tienda de camisetas, somos apasionados por ofrecer productos de la más alta 
            calidad para los verdaderos aficionados del fútbol.
          </p>
        </div>
      </div>

      {/* Nuestra Misión */}
      <section className="py-20" id="mission" style={{ 
        opacity: isVisible['mission'] ? 1 : 0,
        transform: isVisible['mission'] ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll" id="mission">
            <h2 className="text-4xl font-bold mb-8 relative inline-block">
              Nuestra Misión
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></span>
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Nos dedicamos a proporcionar camisetas de fútbol con calidad excepcional, diseñadas para los aficionados más exigentes. 
              Nuestra pasión es conectar a los fanáticos con los equipos que aman a través de productos que destacan por su 
              autenticidad, calidad y personalización.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Creemos que cada aficionado merece la oportunidad de vestir con orgullo los colores de su equipo, sin comprometer 
              la calidad ni pagar precios excesivos. Por eso, trabajamos directamente con fabricantes para ofrecerte lo mejor.
            </p>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center relative inline-block left-1/2 -translate-x-1/2">
            Por Qué Elegirnos
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.id} 
                className="animate-on-scroll"
                id={feature.id}
                style={{ 
                  opacity: isVisible[feature.id] ? 1 : 0,
                  transform: isVisible[feature.id] ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`
                }}
              >
                <div className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 h-full border-t-4 border-red-500 hover:-translate-y-2">
                  <div className="flex justify-center mb-6 text-red-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center relative inline-block left-1/2 -translate-x-1/2">
            Preguntas Frecuentes
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></span>
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id}
                className="mb-6 border-b border-gray-200 pb-4 animate-on-scroll"
                id={`faq-${faq.id}`}
                style={{ 
                  opacity: isVisible[`faq-${faq.id}`] ? 1 : 0,
                  transform: isVisible[`faq-${faq.id}`] ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`
                }}
              >
                <button
                  className="flex justify-between items-center w-full text-left py-4 focus:outline-none group"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="text-lg font-medium group-hover:text-red-600 transition-colors duration-200">
                    {faq.question}
                  </span>
                  <span className={`transition-transform duration-300 text-red-600 ${openFaqId === faq.id ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${openFaqId === faq.id ? 'max-h-80' : 'max-h-0'}`}
                >
                  <p className="pb-4 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center animate-on-scroll" id="cta"
          style={{ 
            opacity: isVisible['cta'] ? 1 : 0,
            transform: isVisible['cta'] ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}
        >
          <h2 className="text-4xl font-bold mb-6">¿Listo para lucir los colores de tu equipo?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Contactanos hoy mismo y te ayudaremos a encontrar la camiseta perfecta para vos.
          </p>
          <button className="bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-xl hover:shadow-red-500/30">
            Hacer un Pedido
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;