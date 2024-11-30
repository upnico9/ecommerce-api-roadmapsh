import { CartController } from "../controllers/cartController.js";
import { cartSchema } from "../validators/cartValidator.js";

export default function cartRoutes(fastify, options) {
    fastify.get('/', {
        onRequest: [fastify.authenticate],
        handler: CartController.getCart,
    });

    fastify.post('/', {
        onRequest: [fastify.authenticate],
        schema: cartSchema.createCart,
        handler: CartController.createCart,
    });

    fastify.put('/', {
        onRequest: [fastify.authenticate],
        schema: cartSchema.updateCart,
        handler: CartController.updateCart,
    });

    fastify.delete('/', {
        onRequest: [fastify.authenticate],
        handler: CartController.deleteCart,
    });
}