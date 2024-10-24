import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, updateProduct, fetchProducts } from '../redux/actions/productActions';

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
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        dispatch(fetchProducts()); // Cargar productos al iniciar el componente
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value,
        });
    };

    const handleAddProduct = () => {
        dispatch(addProduct(newProduct));
        setSuccessMessage('Producto agregado exitosamente!');
        resetForm();
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
            dispatch(updateProduct(editProduct.id, newProduct));
            setSuccessMessage('Producto actualizado exitosamente!');
            resetForm();
            setEditProduct(null);
        }
    };

    const handleDeleteProduct = (id) => {
        dispatch(deleteProduct(id));
        setSuccessMessage('Producto eliminado exitosamente!');
    };

    const resetForm = () => {
        setNewProduct({ name: '', description: '', price: '', image_url: '' });
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            {successMessage && <div className="success-message">{successMessage}</div>} {/* Mensaje de éxito */}

            {/* Formulario para agregar productos */}
            <div className="add-product-form">
                <h3>{editProduct ? 'Editar Producto' : 'Agregar Producto'}</h3>
                <input type="text" name="name" placeholder="Nombre" value={newProduct.name} onChange={handleInputChange} />
                <input type="text" name="description" placeholder="Descripción" value={newProduct.description} onChange={handleInputChange} />
                <input type="number" name="price" placeholder="Precio" value={newProduct.price} onChange={handleInputChange} />
                <input type="text" name="image_url" placeholder="URL de la imagen" value={newProduct.image_url} onChange={handleInputChange} />
                <button onClick={editProduct ? handleUpdateProduct : handleAddProduct}>
                    {editProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
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
        </div>
    );
};

export default AdminPanel;
