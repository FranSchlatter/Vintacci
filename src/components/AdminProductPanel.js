import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProductPanel = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image_url: ''
    });
    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.image_url) {
            console.error('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/products', newProduct);
            setProducts((prevProducts) => [...prevProducts, response.data]);
            setNewProduct({ name: '', description: '', price: '', image_url: '' });
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
        setNewProduct({ name: product.name, description: product.description, price: product.price, image_url: product.image_url });
    };

    const handleUpdateProduct = async () => {
        if (!editProduct) return;

        try {
            const response = await axios.put(`http://localhost:5000/products/${editProduct.id}`, newProduct);
            setProducts((prevProducts) =>
                prevProducts.map((product) => (product.id === editProduct.id ? response.data : product))
            );
            setEditProduct(null);
            setNewProduct({ name: '', description: '', price: '', image_url: '' });
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/products/${id}`);
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
        }
    };

    return (
        <div className="admin-product-panel p-5 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Panel de Administración de Productos</h2>
            <div className="add-product-form mb-4">
                <h3 className="text-lg font-semibold mb-2">Agregar Producto</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Descripción"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Precio"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="image_url"
                    placeholder="URL de la imagen"
                    value={newProduct.image_url}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={editProduct ? handleUpdateProduct : handleAddProduct} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    {editProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
            </div>

            <div className="product-list">
                <h3 className="text-lg font-semibold mb-2">Lista de Productos</h3>
                {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between mb-2 p-2 border-b">
                        <div>
                            <p>Nombre: {product.name}</p>
                            <p>Descripción: {product.description}</p>
                            <p>Precio: ${product.price}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEditProduct(product)} className="bg-yellow-400 text-white p-1 mr-2 rounded hover:bg-yellow-500">
                                Editar
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600">
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProductPanel;
