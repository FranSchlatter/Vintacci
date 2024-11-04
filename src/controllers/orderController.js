// src/controllers/orderController.js
const { Order, OrderItem, Product, Invoice } = require('../models');
const sequelize = require('../../db');

const orderController = {
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        as: 'items',  // Usamos el alias definido en las asociaciones
                        include: [Product]
                    },
                    {
                        model: Invoice,
                        as: 'invoice'  // Agregamos el alias aquí
                    }
                ],
                order: [['created_at', 'DESC']]
            });
            res.json(orders);
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
            res.status(500).json({ error: 'Error al obtener órdenes' });
        }
    },

    createOrder: async (req, res) => {
        const { items, shipping, billing, total, shipping_method, shipping_cost, payment_method } = req.body;

        if (!shipping_method || !shipping_cost) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'shipping_method and shipping_cost are required'
            });
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                // 1. Crear la orden
                const order = await Order.create({
                    total,
                    status: 'pending',
                    shipping_address: shipping,
                    billing_address: billing,
                    shipping_method,
                    shipping_cost,
                    payment_method: payment_method || 'credit_card'
                }, { transaction: t });

                // 2. Crear items y actualizar stock
                const orderItems = await Promise.all(
                    items.map(async (item) => {
                        const product = await Product.findByPk(item.id, { transaction: t });
                        if (!product || product.stock < item.quantity) {
                            throw new Error(`Stock insuficiente para ${product.name}`);
                        }

                        await product.update({
                            stock: product.stock - item.quantity
                        }, { transaction: t });

                        return OrderItem.create({
                            order_id: order.id,
                            product_id: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }, { transaction: t });
                    })
                );

                // 3. Crear factura
                const invoice = await Invoice.create({
                    order_id: order.id,
                    invoice_number: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    date: new Date(),
                    subtotal: total - shipping_cost,
                    tax: (total - shipping_cost) * 0.21,
                    total: total
                }, { transaction: t });

                return {
                    ...order.toJSON(),
                    items: orderItems,
                    invoice
                };
            });

            res.status(201).json(result);
        } catch (err) {
            console.error('Error al crear la orden:', err);
            res.status(500).json({
                error: 'Error al crear la orden',
                message: err.message
            });
        }
    },

    getOrderById: async (req, res) => {
        const { id } = req.params;
    
        try {
            const order = await Order.findByPk(id, {
                include: [
                    {
                        model: OrderItem,
                        as: 'items',
                        include: [Product]
                    },
                    {
                        model: Invoice,
                        as: 'invoice'
                    }
                ]
            });
            
            if (!order) {
                console.error('No se encontró la orden');
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
            
            res.json(order);
        } catch (error) {
            console.error('Error al obtener la orden:', error);
            res.status(500).json({ error: 'Error al obtener la orden' });
        }
    },
    
    updateOrderStatus: async (req, res) => {
        const { id } = req.params;
        const { 
            status, 
            tracking_number,
            shipping_address,
            billing_address,
            shipping_method,
            shipping_cost,
            payment_method,
            notes,
            total
        } = req.body;
    
        try {
            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
    
            // Actualizamos todos los campos que vengan en el body
            const updateData = {
                ...(status && { status }),
                ...(tracking_number && { tracking_number }),
                ...(shipping_address && { shipping_address }),
                ...(billing_address && { billing_address }),
                ...(shipping_method && { shipping_method }),
                ...(shipping_cost && { shipping_cost }),
                ...(payment_method && { payment_method }),
                ...(notes && { notes }),
                ...(total && { total })
            };
    
            await order.update(updateData);
    
            // Si se cancela la orden, restaurar stock
            if (status === 'cancelled') {
                const orderItems = await OrderItem.findAll({
                    where: { order_id: id },
                    include: [Product]
                });
    
                await Promise.all(orderItems.map(async (item) => {
                    await item.Product.increment('stock', { by: item.quantity });
                }));
            }
    
            // Obtener la orden actualizada con todas sus relaciones
            const updatedOrder = await Order.findByPk(id, {
                include: [
                    {
                        model: OrderItem,
                        as: 'items',
                        include: [Product]
                    },
                    {
                        model: Invoice,
                        as: 'invoice'
                    }
                ]
            });
    
            res.json(updatedOrder);
        } catch (err) {
            console.error('Error al actualizar la orden:', err);
            res.status(500).json({ 
                error: 'Error al actualizar la orden',
                message: err.message 
            });
        }
    },

    deleteOrder: async (req, res) => {
        const { id } = req.params;
    
        try {
            const order = await Order.findByPk(id, {
                include: ['items']
            });
    
            if (!order) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
    
            // Restaurar el stock de los productos
            await Promise.all(
                order.items.map(async (item) => {
                    const product = await Product.findByPk(item.product_id);
                    if (product) {
                        await product.update({
                            stock: product.stock + item.quantity
                        });
                    }
                })
            );
    
            await order.destroy();
            res.status(204).send();
        } catch (err) {
            console.error('Error al eliminar la orden:', err);
            res.status(500).json({ 
                error: 'Error al eliminar la orden',
                message: err.message 
            });
        }
    },

    generateInvoice: async (req, res) => {
        const { orderId } = req.params;
        
        try {
            const order = await Order.findByPk(orderId);
            
            if (!order) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }

            const orderItems = await OrderItem.findAll({
                where: { order_id: orderId },
                include: [Product]
            });

            const subtotal = order.total - (order.shipping_cost || 0);
            const tax = subtotal * 0.21;

            const invoice = await Invoice.create({
                order_id: orderId,
                invoice_number: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                date: new Date(),
                subtotal: subtotal,
                tax: tax,
                total: order.total
            });

            res.status(201).json({
                ...invoice.toJSON(),
                order: {
                    ...order.toJSON(),
                    items: orderItems
                }
            });

        } catch (err) {
            console.error('Error al generar factura:', err);
            res.status(500).json({ 
                error: 'Error al generar la factura',
                details: err.message
            });
        }
    }
};

module.exports = orderController;