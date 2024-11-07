// src/controllers/emailController.js
const EmailService = require('../config/emailService');

const emailController = {
    sendWelcome: async (req, res) => {
        try {
            const userData = req.body;
            await EmailService.sendWelcomeEmail(userData);
            res.status(200).json({ message: 'Welcome email sent successfully' });
        } catch (error) {
            console.error('Welcome email error:', error);
            res.status(500).json({ error: 'Error sending welcome email' });
        }
    },

    sendContactConfirm: async (req, res) => {
        console.log('sendContactConfirm')
        try {
            const contactData = req.body;
            await EmailService.sendContactConfirmEmail(contactData);
            res.status(200).json({ message: 'Contact confirmation sent successfully' });
        } catch (error) {
            console.error('Contact confirm error:', error);
            res.status(500).json({ error: 'Error sending contact confirmation' });
        }
    },

    sendContactStaff: async (req, res) => {
        console.log('sendContactStaff')
        try {
            const contactData = req.body;
            await EmailService.sendContactStaffEmail(contactData);
            res.status(200).json({ message: 'Staff notification sent successfully' });
        } catch (error) {
            console.error('Contact staff error:', error);
            res.status(500).json({ error: 'Error sending staff notification' });
        }
    },

    sendOrderCreated: async (req, res) => {
        try {
            const orderData = req.body;
            await EmailService.sendOrderCreatedEmail(orderData);
            res.status(200).json({ message: 'Order created email sent successfully' });
        } catch (error) {
            console.error('Order created email error:', error);
            res.status(500).json({ error: 'Error sending order created email' });
        }
    },

    sendOrderStatus: async (req, res) => {
        try {
            const orderData = req.body;
            await EmailService.sendOrderStatusEmail(orderData);
            res.status(200).json({ message: 'Order status email sent successfully' });
        } catch (error) {
            console.error('Order status email error:', error);
            res.status(500).json({ error: 'Error sending order status email' });
        }
    },

    sendOrderCustom: async (req, res) => {
        try {
            const { orderId, ...emailData } = req.body;
            await EmailService.sendOrderCustomEmail(orderId, emailData);
            res.status(200).json({ message: 'Custom order email sent successfully' });
        } catch (error) {
            console.error('Custom order email error:', error);
            res.status(500).json({ error: 'Error sending custom order email' });
        }
    },

    sendNewProduct: async (req, res) => {
        try {
            const productData = req.body;
            await EmailService.sendNewProductEmail(productData);
            res.status(200).json({ message: 'New product email sent successfully' });
        } catch (error) {
            console.error('New product email error:', error);
            res.status(500).json({ error: 'Error sending new product email' });
        }
    },

    sendOffer: async (req, res) => {
        try {
            const offerData = req.body;
            await EmailService.sendOfferEmail(offerData);
            res.status(200).json({ message: 'Offer email sent successfully' });
        } catch (error) {
            console.error('Offer email error:', error);
            res.status(500).json({ error: 'Error sending offer email' });
        }
    }
};

module.exports = emailController;
