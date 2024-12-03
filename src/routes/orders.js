import { OrderController } from "../controllers/orderController.js";

export default function orderRoutes(fastify, options) {
    fastify.post('/', {
        onRequest: [fastify.authenticate],
        handler: OrderController.createOrder,
    });

    // fastify.get('/', {
    //     onRequest: [fastify.authenticate],
    //     handler: OrderController.getOrders,
    // });

    fastify.get('/:id', {
        onRequest: [fastify.authenticate],
        handler: OrderController.getOrderById,
    });

    // fastify.put('/:id/status', {
    //     onRequest: [fastify.authenticate],
    //     handler: OrderController.updateOrderStatus,
    // });

    fastify.post('/:id/confirm', {
        onRequest: [fastify.authenticate],
        handler: OrderController.confirmOrder,
    });

    // fastify.delete('/:id', {
    //     onRequest: [fastify.authenticate, fastify.isAdmin],
    //     handler: OrderController.deleteOrder,
    // });
}