// src/pages/AboutPage.js
import React from 'react';
import { ShoppingBag, Clock, Truck, Heart } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <ShoppingBag size={32} />,
      title: 'Selección Única',
      description: 'Cada prenda es cuidadosamente seleccionada para garantizar calidad y autenticidad.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Historia Vintage',
      description: 'Prendas que cuentan historias y traen de vuelta la moda de épocas pasadas.'
    },
    {
      icon: <Truck size={32} />,
      title: 'Envío Seguro',
      description: 'Empaque especial para proteger tus prendas vintage durante el envío.'
    },
    {
      icon: <Heart size={32} />,
      title: 'Pasión por la Moda',
      description: 'Dedicación a encontrar las mejores piezas vintage para nuestros clientes.'
    }
  ];

  const team = [
    {
      name: 'Ana García',
      role: 'Fundadora',
      image: 'https://img.freepik.com/foto-gratis/vista-frontal-elegante-empresaria-sosteniendo-portapapeles-espacio-copia_23-2148788842.jpghttps://img.freepik.com/fotos-premium/retrato-mujer-negocios-profesional-empresa-u-oficina_753390-7545.jpg',
      description: 'Apasionada por la moda vintage y con más de 10 años de experiencia en el sector.'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Curador de Moda',
      image: 'https://media.istockphoto.com/id/1399565382/es/foto/joven-empresario-mestizo-feliz-de-pie-con-los-brazos-cruzados-trabajando-solo-en-una-oficina.jpg?s=612x612&w=0&k=20&c=Tls7PDwhSbA9aaVg0RkpfPfWYaQrfecN319aOCKuU34=',
      description: 'Experto en identificar piezas únicas y autenticar prendas vintage.'
    },
    {
      name: 'Laura Martínez',
      role: 'Estilista',
      image: 'https://img.freepik.com/foto-gratis/mujer-profesional-su-oficina_23-2147636008.jpg',
      description: 'Especialista en combinar lo vintage con lo contemporáneo.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre Vintacci</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Somos más que una tienda de ropa vintage; somos custodios de la historia 
            de la moda, trayendo el pasado al presente de manera única y sostenible.
          </p>
        </div>
      </div>

      {/* Nuestra Historia */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Nuestra Historia</h2>
            <p className="text-gray-600 mb-6">
              Vintacci nació de la pasión por la moda atemporal y el deseo de dar nueva 
              vida a prendas únicas. Desde nuestros inicios en 2020, nos hemos dedicado 
              a crear una colección cuidadosamente curada de piezas vintage que cuentan 
              historias y traen consigo el encanto de épocas pasadas.
            </p>
            <p className="text-gray-600">
              Nuestra misión es promover la moda sostenible mientras ofrecemos piezas 
              únicas que no encontrarás en ningún otro lugar. Cada prenda en nuestra 
              colección es seleccionada con amor y cuidado, asegurando que cumpla con 
              nuestros altos estándares de calidad y autenticidad.
            </p>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="text-center p-6 bg-white rounded-lg shadow-md"
              >
                <div className="flex justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div 
                key={member.name} 
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;