// src/config/emailService.js
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// IDs de los templates en SendGrid
const TEMPLATES = {
    // Usuario
    WELCOME: 'd-3cc19b81af0948b9ac624a7532770ac9',              // Template de bienvenida

    // Contacto
    CONTACT_STAFF: 'd-2577da77bc2c48768885d425fdffd8ee',        // Email al staff
    CONTACT_CONFIRMATION: 'd-2739181f87644579a2d94f6cde04afe9',  // Confirmación al cliente

    // Órdenes
    ORDER_CREATED: 'd-fa8c76b3d04e41c7bfa84519e07339c1',         // Nueva orden
    ORDER_STATUS: {
        processing: 'd-22f9c76b1c8942559da6de03c41bb230',
        shipped: 'd-328256df30754c9cb58f1488fe3b8508',
        delivered: 'd-6a613562805346a494cc2059b0d188a8',
        cancelled: 'd-9b694c0906de41f7aa7b351b659effeb'
    },
    ORDER_CUSTOM: 'd-a65a188de9dd47b19783fb7a7418d304',          // Email personalizado

    // TODO: Newsletter
    NEW_PRODUCT: 'd-xxxxxx',
    OFFER: 'd-xxxxxx'
};

const sendEmail = async (to, templateId, dynamicTemplateData) => {
    const msg = {
        to,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: process.env.SENDGRID_FROM_NAME
        },
        templateId,
        dynamicTemplateData
    };

    try {
        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error('Error en sendEmail:', error.response?.body || error);
        throw error;
    }
};
const EmailService = {
    // Email de bienvenida
    sendWelcomeEmail: async (userData) => {
        return sendEmail(
            userData.email,
            TEMPLATES.WELCOME,
            {   
                firstName: userData.first_name,
                lastName: userData.last_name,
                loginUrl: `${process.env.FRONTEND_URL}/login`,
                preferencesUrl: `${process.env.FRONTEND_URL}/profile`
            }
        );
    },

    // Email de confirmación al cliente (contacto)
    sendContactConfirmEmail: async (contactData) => {
        return sendEmail(
            contactData.email,
            TEMPLATES.CONTACT_CONFIRMATION,
            {
                name: contactData.name,
                email: contactData.email,
                subject: contactData.subject,
                message: contactData.message
            }
        );
    },

    // Email al staff (contacto)
    sendContactStaffEmail: async (contactData) => {
        return sendEmail(
            process.env.CONTACT_EMAIL,
            TEMPLATES.CONTACT_STAFF,
            {
                name: contactData.name,
                email: contactData.email,
                subject: contactData.subject,
                message: contactData.message,
                date: new Date().toLocaleDateString()
            }
        );
    },

    // Email de nueva orden
    sendOrderCreatedEmail: async (orderData) => {
        // if (!orderData.user?.email || !orderData.user?.preferences?.order_notifications) {
        //     return false;
        // } 

        return sendEmail(
            orderData.user.email,
            TEMPLATES.ORDER_CREATED,
            {
                customerName: `${orderData.user.first_name} ${orderData.user.last_name}`,
                orderNumber: orderData.id,
                orderDate: new Date(orderData.createdAt).toLocaleDateString(),
                status: orderData.status,
                paymentMethod: orderData.payment_method,
                
                // Detalles de productos
                orderDetails: orderData.items.map(item => ({
                    name: item.Product.name,
                    quantity: item.quantity,
                    price: item.price,
                    imageUrl: item.Product.image_url,
                    size: item.Product.size
                })),
    
                // Costos
                subtotal: orderData.invoice.subtotal,
                tax: orderData.invoice.tax,
                shippingCost: orderData.shipping_cost,
                total: orderData.total,
    
                // Dirección de envío
                shippingAddress: {
                    firstName: orderData.shipping_address.first_name,
                    lastName: orderData.shipping_address.last_name,
                    street: orderData.shipping_address.street,
                    number: orderData.shipping_address.number,
                    apartment: orderData.shipping_address.apartment,
                    city: orderData.shipping_address.city,
                    state: orderData.shipping_address.state,
                    postalCode: orderData.shipping_address.postal_code,
                    country: orderData.shipping_address.country,
                    phone: orderData.shipping_address.phone
                },
    
                // Notas adicionales
                notes: orderData.notes,
                
                // URL de la orden
                orderUrl: `${process.env.FRONTEND_URL}/orders/${orderData.id}`
            }
        );
    },

    // Email de cambio de estado de orden
    sendOrderStatusEmail: async (orderData) => {
        // if (!orderData.user?.email || !orderData.user?.preferences?.order_notifications) {
        //     return false;
        // }

        const templateId = TEMPLATES.ORDER_STATUS[orderData.status];
        if (!templateId) return false;

        // Datos base que todos los emails de estado compartirán
        const baseEmailData = {
            orderNumber: orderData.id,
            customerName: `${orderData.user.first_name} ${orderData.user.last_name}`,
            status: orderData.status,
            statusDate: new Date().toLocaleDateString(),
            total: orderData.total,
            orderUrl: `${process.env.FRONTEND_URL}/orders/${orderData.id}`,
            orderDetails: orderData.items.map(item => ({
                name: item.Product.name,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.Product.image_url,
                size: item.Product.size
            })),
            shippingAddress: {
                firstName: orderData.shipping_address.first_name,
                lastName: orderData.shipping_address.last_name,
                street: orderData.shipping_address.street,
                number: orderData.shipping_address.number,
                apartment: orderData.shipping_address.apartment,
                city: orderData.shipping_address.city,
                state: orderData.shipping_address.state,
                postalCode: orderData.shipping_address.postal_code,
                country: orderData.shipping_address.country,
                phone: orderData.shipping_address.phone
            }
        };

        // Datos específicos según el estado
        let specificData = {};
        switch (orderData.status) {
            case 'shipped':
                specificData = {
                    trackingNumber: orderData.tracking_number || 'No disponible',
                    shippingMethod: orderData.shipping_method,
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
                };
                break;
            case 'delivered':
                specificData = {
                    deliveryDate: new Date().toLocaleDateString()
                };
                break;
            case 'cancelled':
                specificData = {
                    cancellationDate: new Date().toLocaleDateString(),
                    refundAmount: orderData.total
                };
                break;
            default:
                break;
        }
        
        return sendEmail(
            orderData.user.email,
            templateId,
            {
                ...baseEmailData,
                ...specificData
            }
        );
    },

    sendOrderCustomEmail: async (orderId, emailContent) => {
        try {
            // Obtener los datos completos de la orden
            const response = await axios.get(`http://localhost:5000/orders/${orderId}`);
            const orderData = response.data;

            if (!orderData.user?.email) return false;

            return sendEmail(
                orderData.user.email,
                TEMPLATES.ORDER_CUSTOM,
                {
                    orderNumber: orderData.id,
                    customerName: `${orderData.user.first_name} ${orderData.user.last_name}`,
                    subject: emailContent.subject,
                    message: emailContent.message,
                    estimatedDate: emailContent.estimatedDate || null,
                    orderUrl: `${process.env.FRONTEND_URL}/orders/${orderData.id}`,
                    orderDetails: orderData.items.map(item => ({
                        name: item.Product.name,
                        quantity: item.quantity,
                        price: item.price,
                        imageUrl: item.Product.image_url,
                        size: item.Product.size
                    })),
                    currentStatus: orderData.status
                }
            );
        } catch (error) {
            console.error('Error in sendOrderCustomEmail:', error);
            throw error;
        }
    },

    // Email de nuevo producto
    sendNewProductEmail: async (productData) => {
        // Aquí podrías obtener los usuarios con preferences.new_products = true
        const subscribedUsers = []; // Implementar lógica para obtener usuarios suscritos
        
        return sendEmail(
            subscribedUsers.map(user => user.email),
            TEMPLATES.NEW_PRODUCT,
            {
                productName: productData.name,
                productDescription: productData.description,
                productPrice: productData.price,
                productImage: productData.image,
                productUrl: `${process.env.FRONTEND_URL}/products/${productData.id}`
            }
        );
    },

    // Email de oferta
    sendOfferEmail: async (offerData) => {
        // Aquí podrías obtener los usuarios con preferences.offers = true
        const subscribedUsers = []; // Implementar lógica para obtener usuarios suscritos

        return sendEmail(
            subscribedUsers.map(user => user.email),
            TEMPLATES.OFFER,
            {
                offerTitle: offerData.title,
                offerDescription: offerData.description,
                offerDiscount: offerData.discount,
                offerExpiration: offerData.expirationDate,
                offerUrl: `${process.env.FRONTEND_URL}/offers/${offerData.id}`
            }
        );
    }
};

module.exports = EmailService;