// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-cover bg-center h-screen text-white flex items-center justify-center opacity-75 brightness-35" style={{ backgroundImage: "url('https://offloadmedia.feverup.com/cdmxsecreta.com/wp-content/uploads/2023/07/21014525/Lugares-de-ropa-vintage-en-cdmx.jpg')" }}>
        <div className="text-center"> 
          <h1 className="text-5xl font-bold mb-4">Bienvenido a Vintacci</h1>
          <p className="text-xl mb-6">Ropa vintage de las mejores marcas</p>
          <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ver Productos</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="category-card bg-white p-4 rounded-lg shadow-lg">
            <img src="https://d22fxaf9t8d39k.cloudfront.net/6495fdc16ac9276bdb45d0980794888fbe0df50b90af456100f2a8f92961cdb1188374.jpg" alt="Category 1" className="h-40 w-full object-cover mb-4" />
            <h3 className="text-xl font-bold">Camperas</h3>
          </div>
          <div className="category-card bg-white p-4 rounded-lg shadow-lg">
            <img src="https://d22fxaf9t8d39k.cloudfront.net/6495fdc16ac9276bdb45d0980794888fbe0df50b90af456100f2a8f92961cdb1188374.jpg" alt="Category 2" className="h-40 w-full object-cover mb-4" />
            <h3 className="text-xl font-bold">Hoodies</h3>
          </div>
          <div className="category-card bg-white p-4 rounded-lg shadow-lg">
            <img src="https://d22fxaf9t8d39k.cloudfront.net/6495fdc16ac9276bdb45d0980794888fbe0df50b90af456100f2a8f92961cdb1188374.jpg" alt="Category 3" className="h-40 w-full object-cover mb-4" />
            <h3 className="text-xl font-bold">Jeans</h3>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Puedes agregar un map aquí para cargar productos destacados */}
          <div className="product-card bg-white p-4 rounded-lg shadow-lg">
            <img src="https://d22fxaf9t8d39k.cloudfront.net/37c67add3a5dd2e48ad8755491401ffb338e302066d3874c12793b87eb5d0984161191.png" alt="Product 1" className="h-40 w-full object-cover mb-4" />
            <h3 className="text-xl font-bold">Producto 1</h3>
            <p className="text-gray-700">$49.99</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Agregar al Carrito</button>
          </div>
          <div className="product-card bg-white p-4 rounded-lg shadow-lg">
            <img src="https://d22fxaf9t8d39k.cloudfront.net/37c67add3a5dd2e48ad8755491401ffb338e302066d3874c12793b87eb5d0984161191.png" alt="Product 1" className="h-40 w-full object-cover mb-4" />
            <h3 className="text-xl font-bold">Producto 1</h3>
            <p className="text-gray-700">$49.99</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Agregar al Carrito</button>
          </div>
          <div className="product-card bg-white p-4 rounded-lg shadow-lg">
            <img src="https://d22fxaf9t8d39k.cloudfront.net/37c67add3a5dd2e48ad8755491401ffb338e302066d3874c12793b87eb5d0984161191.png" alt="Product 1" className="h-40 w-full object-cover mb-4" />
            <h3 className="text-xl font-bold">Producto 1</h3>
            <p className="text-gray-700">$49.99</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Agregar al Carrito</button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="my-16 bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Sobre Nosotros</h2>
          <p className="text-lg text-gray-700">En Vintacci nos especializamos en traer las mejores prendas vintage de las marcas más icónicas del mundo. Cada pieza es única, cuidadosamente seleccionada para que puedas lucir lo mejor del pasado.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;