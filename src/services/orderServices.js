import stripe from '../config/stripe.js';
import { CartService } from "./cartService.js";
import { CustomError } from "../utils/errors.js";
import Order from "../models/orders.js";

export class OrderService {
    static async createOrder(userId, orderData) {
        try {
            const cart = await CartService.getCart(userId);
            if (!cart || !cart.items.length) {
                throw new CustomError("Cart is empty", 400);
            }

            const totalAmount = cart.items.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount * 100),
                currency: 'eur',
                metadata: {
                    userId: userId.toString(),
                },
                automatic_payment_methods: {
                    enabled: true,
                }
            });

            const order = new Order({
                user: userId,
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                })),
                totalAmount,
                status: 'pending',
                paymentIntentId: paymentIntent.id,
                shippingAddress: orderData.shippingAddress
            });

            await order.save();

            return {
                order,
                clientSecret: paymentIntent.client_secret
            };
        } catch (error) {
            console.error('Error creating order:', error);
            throw new CustomError(
                `Error creating order: ${error.message}`, 
                error.statusCode || 500
            );
        }
    }

    static async getOrderById(orderId, userId) {
        try {
            const order = await Order.findById(orderId)
                .populate('items.product')
                .populate('user', 'email');

            if (!order) {
                throw new CustomError('Order not found', 404);
            }

            if (order.user._id.toString() !== userId) {
                throw new CustomError('Unauthorized access to order', 403);
            }

            return order;
        } catch (error) {
            throw new CustomError(
                `Error fetching order: ${error.message}`, 
                error.statusCode || 500
            );
        }
    }

    static async getUserOrders(userId) {
        try {
            const orders = await Order.find({ user: userId })
                .populate('items.product')
                .sort({ createdAt: -1 });

            return orders;
        } catch (error) {
            throw new CustomError(
                `Error fetching user orders: ${error.message}`, 
                500
            );
        }
    }

    static async confirmOrder(orderId, paymentIntentId) {
        try {
            const order = await Order.findOne({ _id: orderId, paymentIntentId });
            if (!order) {
                throw new CustomError('Order not found', 404);
            }

            order.status = 'confirmed';
            order.updatedAt = new Date();
            await order.save();

            return order;
        } catch (error) {
            throw new CustomError(
                `Error confirming order: ${error.message}`, 
                error.statusCode || 500
            );
        }
    }

    static async updateOrderStatus(orderId, status, userId) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new CustomError('Order not found', 404);
            }

            if (order.user.toString() !== userId) {
                throw new CustomError('Unauthorized access to order', 403);
            }

            const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                throw new CustomError('Invalid order status', 400);
            }

            order.status = status;
            order.updatedAt = new Date();
            await order.save();

            return order;
        } catch (error) {
            throw new CustomError(
                `Error updating order status: ${error.message}`, 
                error.statusCode || 500
            );
        }
    }

    static async cancelOrder(orderId, userId) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new CustomError('Order not found', 404);
            }

            if (order.user.toString() !== userId) {
                throw new CustomError('Unauthorized access to order', 403);
            }
            if (order.status !== 'pending' && order.status !== 'confirmed') {
                throw new CustomError('Order cannot be cancelled in current status', 400);
            }

            if (order.paymentIntentId) {
                await stripe.refunds.create({
                    payment_intent: order.paymentIntentId
                });
            }

            order.status = 'cancelled';
            order.updatedAt = new Date();
            await order.save();

            return order;
        } catch (error) {
            throw new CustomError(
                `Error cancelling order: ${error.message}`, 
                error.statusCode || 500
            );
        }
    }
}
