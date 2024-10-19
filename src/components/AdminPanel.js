import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, updateProduct, fetchProducts } from '../redux/actions/productActions'; // Asegúrate de importar fetchProducts

const AdminPanel = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image_url: ''
    });

    const [editProduct, setEditProduct] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value,
        });
    };

    const handleAddProduct = () => {
        dispatch(addProduct(newProduct));
        setNewProduct({ name: '', description: '', price: '', image_url: '' });
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            image_url: product.image_url
        });
    };

    const handleUpdateProduct = () => {
        if (editProduct) {
            dispatch(updateProduct(editProduct.id, newProduct));  // Usar el ID del producto editado
            setEditProduct(null);  // Limpiar el producto seleccionado
            setNewProduct({ name: '', description: '', price: '', image_url: '' });  // Limpiar el formulario
        }
    };

    const handleDeleteProduct = (id) => {
        dispatch(deleteProduct(id));
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>

            {/* Formulario para agregar productos */}
            <div className="add-product-form">
                <h3>Agregar Producto</h3>
                <input type="text" name="name" placeholder="Nombre" value={newProduct.name} onChange={handleInputChange} />
                <input type="text" name="description" placeholder="Descripción" value={newProduct.description} onChange={handleInputChange} />
                <input type="number" name="price" placeholder="Precio" value={newProduct.price} onChange={handleInputChange} />
                <input type="text" name="image_url" placeholder="URL de la imagen" value={newProduct.image_url} onChange={handleInputChange} />
                <button onClick={handleAddProduct}>Agregar Producto</button>
            </div>

            {/* Lista de productos para editar o eliminar */}
            <div className="product-list">
                <h3>Lista de Productos</h3>
                {products.map((product) => (
                    <div key={product.id}>
                        <p>{product.name} - ${product.price}</p>
                        <button onClick={() => handleEditProduct(product)}>Editar</button>
                        <button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
                    </div>
                ))}
            </div>

            {/* Formulario para editar productos */}
            {editProduct && (
                <div className="edit-product-form">
                    <h3>Editar Producto</h3>
                    <input type="text" name="name" placeholder="Nombre" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                    <input type="text" name="description" placeholder="Descripción" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <input type="number" name="price" placeholder="Precio" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                    <input type="text" name="image_url" placeholder="URL de la imagen" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} />
                    <button onClick={handleUpdateProduct}>Actualizar Producto</button>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;