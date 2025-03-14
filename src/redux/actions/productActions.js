import axios from 'axios';
import { toast } from 'react-toastify';

// Action Types
export const PRODUCT_ACTIONS = {
    FETCH_REQUEST: 'FETCH_PRODUCTS_REQUEST',
    FETCH_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
    FETCH_FAILURE: 'FETCH_PRODUCTS_FAILURE',
    ADD_REQUEST: 'ADD_PRODUCT_REQUEST',
    ADD_SUCCESS: 'ADD_PRODUCT_SUCCESS',
    ADD_FAILURE: 'ADD_PRODUCT_FAILURE',
    UPDATE_REQUEST: 'UPDATE_PRODUCT_REQUEST',
    UPDATE_SUCCESS: 'UPDATE_PRODUCT_SUCCESS',
    UPDATE_FAILURE: 'UPDATE_PRODUCT_FAILURE',
    DELETE_REQUEST: 'DELETE_PRODUCT_REQUEST',
    DELETE_SUCCESS: 'DELETE_PRODUCT_SUCCESS',
    DELETE_FAILURE: 'DELETE_PRODUCT_FAILURE',
    FETCH_BY_ID_REQUEST: 'FETCH_PRODUCT_BY_ID_REQUEST',
    FETCH_BY_ID_SUCCESS: 'FETCH_PRODUCT_BY_ID_SUCCESS',
    FETCH_BY_ID_FAILURE: 'FETCH_PRODUCT_BY_ID_FAILURE',
    CREATE_VARIANT_REQUEST: 'CREATE_VARIANT_REQUEST',
    CREATE_VARIANT_SUCCESS: 'CREATE_VARIANT_SUCCESS',
    CREATE_VARIANT_FAILURE: 'CREATE_VARIANT_FAILURE',
    UPDATE_VARIANT_REQUEST: 'UPDATE_VARIANT_REQUEST',
    UPDATE_VARIANT_SUCCESS: 'UPDATE_VARIANT_SUCCESS',
    UPDATE_VARIANT_FAILURE: 'UPDATE_VARIANT_FAILURE',
    DELETE_VARIANT_REQUEST: 'DELETE_VARIANT_REQUEST',
    DELETE_VARIANT_SUCCESS: 'DELETE_VARIANT_SUCCESS',
    DELETE_VARIANT_FAILURE: 'DELETE_VARIANT_FAILURE'
};

// Helper function to format variant data
const formatVariantData = (variant) => ({
    price: Number(variant.price),
    stock: Number(variant.stock),
    image_url: variant.image_url,
    status: variant.status,
    discountPrice: variant.discountPrice ? Number(variant.discountPrice) : null,
    discountStart: variant.discountStart || null,
    discountEnd: variant.discountEnd || null,
    options: variant.options // Ya debe ser un array de IDs
});

export const addProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: 'ADD_PRODUCT_REQUEST' });
        
        const formattedData = {
            name: productData.name,
            description: productData.description,
            brand: productData.brand,
            categoryId: productData.categoryId,
            status: productData.status,
            tags: productData.tags,
            variants: productData.variants.map(formatVariantData)
        };

        const response = await axios.post('http://localhost:5000/products', formattedData);
        dispatch({ type: 'ADD_PRODUCT_SUCCESS', payload: response.data });
        toast.success('Producto creado exitosamente');
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        dispatch({ 
            type: 'ADD_PRODUCT_FAILURE', 
            payload: error.message 
        });
        toast.error('Error al crear el producto: ' + error.response?.data || error.message);
        throw error;
    }
};

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: 'UPDATE_PRODUCT_REQUEST' });
        
        // Solo formateamos los datos que vamos a actualizar
        const formattedData = {
            name: productData.name,
            description: productData.description,
            brand: productData.brand,
            categoryId: productData.categoryId,
            status: productData.status,
            tags: productData.tags
            // No incluimos variants aquí ya que no las estamos modificando
        };

        const response = await axios.put(`http://localhost:5000/products/${id}`, formattedData);
        dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: response.data });
        toast.success('Producto actualizado exitosamente');
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        dispatch({ 
            type: 'UPDATE_PRODUCT_FAILURE', 
            payload: error.response?.data?.message || 'Error al actualizar producto' 
        });
        toast.error('Error al actualizar producto');
        throw error;
    }
};

export const fetchProducts = ({ page = 1, limit = 20, categoryIds = '', tagIds = [], name = '', sortBy = 'newest' } = {}) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTIONS.FETCH_REQUEST });

        // Serializar el array de objetos tagIds si existe
        const params = {
            page,
            limit,
            categoryIds,
            name,
            sortBy,
            ...(tagIds.length > 0 && { tagIds: JSON.stringify(tagIds) }) // Solo agrega tagIds si hay tags
        };

        const response = await axios.get('http://localhost:5000/products', { params });

        dispatch({
            type: PRODUCT_ACTIONS.FETCH_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        dispatch({
            type: PRODUCT_ACTIONS.FETCH_FAILURE,
            payload: error.response?.data?.message || 'Error al cargar productos'
        });
        toast.error('Error al cargar productos');
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTIONS.DELETE_REQUEST });
        await axios.delete(`http://localhost:5000/products/${id}`);
        dispatch({ type: PRODUCT_ACTIONS.DELETE_SUCCESS, payload: id });
        toast.success('Producto eliminado exitosamente');
    } catch (error) {
        console.error('Error deleting product:', error);
        dispatch({ 
            type: PRODUCT_ACTIONS.DELETE_FAILURE, 
            payload: error.response?.data?.message || 'Error al eliminar producto' 
        });
        toast.error('Error al eliminar producto');
        throw error;
    }
};

export const fetchProductById = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTIONS.FETCH_BY_ID_REQUEST });
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        dispatch({ type: PRODUCT_ACTIONS.FETCH_BY_ID_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        dispatch({ 
            type: PRODUCT_ACTIONS.FETCH_BY_ID_FAILURE, 
            payload: error.response?.data?.message || 'Error al cargar producto' 
        });
        toast.error('Error al cargar producto');
        throw error;
    }
};

export const createVariant = (productId, variantData) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTIONS.CREATE_VARIANT_REQUEST });
        const formattedVariant = formatVariantData(variantData);
        
        const response = await axios.post(
            `http://localhost:5000/products/${productId}/variants`,
            formattedVariant
        );

        dispatch({ 
            type: PRODUCT_ACTIONS.CREATE_VARIANT_SUCCESS, 
            payload: {
                productId,
                variant: response.data
            }
        });
        
        toast.success('Variante creada exitosamente');
        return response.data;
    } catch (error) {
        console.error('Error creating variant:', error);
        dispatch({ 
            type: PRODUCT_ACTIONS.CREATE_VARIANT_FAILURE, 
            payload: error.response?.data?.message || 'Error al crear variante' 
        });
        toast.error('Error al crear variante');
        throw error;
    }
};

export const updateVariant = (productId, variantId, updateData) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTIONS.UPDATE_VARIANT_REQUEST });
        const formattedVariant = formatVariantData(updateData);

        const response = await axios.patch(
            `http://localhost:5000/products/${productId}/variants/${variantId}`,
            formattedVariant
        );

        dispatch({ 
            type: PRODUCT_ACTIONS.UPDATE_VARIANT_SUCCESS, 
            payload: {
                productId,
                variantId,
                updatedVariant: response.data
            }
        });

        toast.success('Variante actualizada exitosamente');
        return response.data;
    } catch (error) {
        console.error('Error updating variant:', error);
        dispatch({ 
            type: PRODUCT_ACTIONS.UPDATE_VARIANT_FAILURE, 
            payload: error.response?.data?.message || 'Error al actualizar variante' 
        });
        toast.error('Error al actualizar variante');
        throw error;
    }
};

export const deleteVariant = (productId, variantId) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_ACTIONS.DELETE_VARIANT_REQUEST });
        
        await axios.delete(
            `http://localhost:5000/products/${productId}/variants/${variantId}`
        );

        dispatch({ 
            type: PRODUCT_ACTIONS.DELETE_VARIANT_SUCCESS, 
            payload: { productId, variantId }
        });
        
        toast.success('Variante eliminada exitosamente');
    } catch (error) {
        console.error('Error deleting variant:', error);
        dispatch({ 
            type: PRODUCT_ACTIONS.DELETE_VARIANT_FAILURE, 
            payload: error.response?.data?.message || 'Error al eliminar variante' 
        });
        toast.error('Error al eliminar variante');
        throw error;
    }
};