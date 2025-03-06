// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import retro_test from '../assets/images/test_pagina_retro.jpg';
import player_test from '../assets/images/test_pagina_player.jpg';
import fans_test from '../assets/images/test_pagina_fans.jpg';
import camiseta_test_1 from '../assets/images/test_pagina_1.webp';
import camiseta_test_2 from '../assets/images/test_pagina_2.webp';
import camiseta_test_3 from '../assets/images/test_pagina_3.webp';
import camiseta_test_4 from '../assets/images/test_pagina_4.webp';
import camiseta_test_5 from '../assets/images/test_pagina_5.webp';
import camiseta_test_6 from '../assets/images/test_pagina_6.webp';


const HomePage = () => {
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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  const categories = [
    { name: 'Jugador', image: player_test },
    { name: 'Retro', image: retro_test },
    { name: 'Fanaticos', image: fans_test },
  ];

  const featuredProducts = [
    { id: 1, name: 'Argentina 1982', price: 75000, image_url: [camiseta_test_1] },
    { id: 2, name: 'España 2010', price: 77000, image_url: [camiseta_test_2] },
    { id: 3, name: 'Francia 1998', price: 75000, image_url: [camiseta_test_3] },
    { id: 4, name: 'Man City 2024', price: 81000, image_url: [camiseta_test_4] },
    { id: 5, name: 'Boca 2024 Vis', price: 73000, image_url: [camiseta_test_5] },
    { id: 6, name: 'Leverkusen Especial', price: 83000, image_url: [camiseta_test_6] }
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="relative py-32 bg-black text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://example.com/hero-image.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-6xl font-extrabold mb-6">Vive la Pasión del Fútbol</h1>
          <p className="text-xl max-w-3xl mx-auto">Camisetas icónicas, ediciones exclusivas y lo mejor de la indumentaria deportiva.</p>
          <Link to="/products" className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300">
            Explorar Colección
          </Link>
        </div>
      </div>

      {/* Categorías */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Explora Nuestras Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="animate-on-scroll cursor-pointer">
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img src={category.image} alt={category.name} className="w-full h-64 object-cover transition duration-300 hover:scale-105" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promociones */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Promociones Especiales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {[
              { title: '50% OFF Segunda Unidad', desc: 'Comprá una y obtené la segunda a mitad de precio.', oldPrice: '$174.000', newPrice: '$130.000' },
              { title: '3x2 - Llevá 3, Pagá 2', desc: 'Elegí 3 camisetas y pagá solo por 2.', oldPrice: '$260.000', newPrice: '$170.000' },
              { title: 'Jugador Completo', desc: 'Camiseta + Short + Medias a un precio especial.', oldPrice: '$150.000', newPrice: '$125.000' }
            ].map((promo, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-bold text-red-600 mb-2">{promo.title}</h3>
                <p className="text-gray-600 mb-4">{promo.desc}</p>
                <p className="text-gray-400 line-through text-lg">{promo.oldPrice}</p>
                <p className="text-2xl font-bold text-gray-900">{promo.newPrice}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados con Slider */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Productos Destacados</h2>
          <Slider {...sliderSettings}>
            {featuredProducts.map(product => (
              <div key={product.id} className="px-2">
                <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mb-2">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Link to={`/products/${product.id}`}>
                      <img src={product.image_url[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200" />
                    </Link>
                  </div>
                  <div className="p-4 space-y-2">
                    <Link to={`/products/${product.id}`} className="block text-gray-800 font-medium hover:text-red-600 truncate">
                      {product.name}
                    </Link>
                    <p className="text-lg font-bold text-gray-700">${product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Encuentra Tu Camiseta Perfecta</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">Productos premium, envíos a todo el país y la mejor atención.</p>
          <Link to="/products" className="bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300">
            Ver Catálogo Completo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;