import { OrderService } from "../services/orderServices.js";

export class OrderController {
    static async createOrder(request, reply) {
        try {
            const userId = request.user.userId;
            const { shippingAddress } = request.body;
            
            const result = await OrderService.createOrder(userId, {
                shippingAddress
            });

            return reply.status(201).send({
                orderId: result.order._id,
                clientSecret: result.clientSecret
            });
        } catch (error) {
            return reply.status(error.statusCode || 500).send({ 
                message: error.message 
            });
        }
    }

    static async getOrderById(request, reply) {
        try {
            const userId = request.user.userId;
            const orderId = request.params.id;
            
            const order = await OrderService.getOrderById(orderId, userId);
            return reply.status(200).send(order);
        } catch (error) {
            return reply.status(error.statusCode || 500).send({ 
                message: error.message 
            });
        }
    }

    static async confirmOrder(request, reply) {
        const orderId = request.params.id;
        const { paymentIntentId } = request.body;
        await OrderService.confirmOrder(orderId, paymentIntentId);
        return reply.status(200).send({ message: 'Order confirmed' });
    }

}