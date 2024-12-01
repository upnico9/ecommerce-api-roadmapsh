import { CartService } from "../services/cartService.js";

export class CartController {
    static async getCart(request, reply) {
        try {
            const userId = request.user.userId;
            const cart = await CartService.getCart(userId);
            return reply.status(200).send(cart);
        } catch (error) {
            return reply.status(error.statusCode || 500).send({ message: error.message });
        }
    }

    static async createCart(request, reply) {
        try {
            const userId = request.user.userId;
            const { productId } = request.body;
            const cart = await CartService.createCart(userId, productId);
            return reply.status(201).send(cart);
        } catch (error) {
            return reply.status(error.statusCode || 500).send({ message: error.message });
        }
    }

    static async updateQuantity(request, reply) {
        try {
            const userId = request.user.userId;
            const { productId, quantity } = request.body;
            const cart = await CartService.updateQuantity(userId, productId, quantity);
            return reply.status(200).send(cart);
        } catch (error) {
            return reply.status(error.statusCode || 500).send({ message: error.message });
        }
    }

    static async deleteItem(request, reply) {
        try {
            const userId = request.user.userId;
            const { productId } = request.body;
            const cart = await CartService.deleteItem(userId, productId);
            return reply.status(200).send(cart);
        } catch (error) {
            return reply.status(error.statusCode || 500).send({ message: error.message });
        }
    }
}
