import Cart from "../models/cart.js";
import { CustomError } from "../utils/errors.js";

export class CartService {
    static async getCart(userId) {
        console.log(userId);
        let cart = await Cart.findOne({ userId }).populate('items.product');
        if (!cart) {
            throw new CustomError("Cart not found", 404);
        }
        return cart;
    }

    static async createCart(userId, productId) {
        let cart = await Cart.findOne({ userId }).populate('items.product');
        console.log(cart);
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.product?._id?.equals(productId));

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ product: productId, quantity: 1 });
        }

        cart = await cart.save();
        // Need to re-populate after modifications
        cart = await cart.populate('items.product');

        await this.calculateCartTotal(cart);
        return await cart.save();
    }

    static async updateQuantity(userId, productId, quantity) {
        const cart = await Cart.findOne({ userId }).populate('items.product');
        const item = cart.items.find(item => item.product._id.equals(productId));
        if (!item) {
            throw new Error('Item not found in cart');
        }
        item.quantity = quantity;

        if (item.quantity <= 0) {
            cart.items = cart.items.filter(item => !item.product._id.equals(productId));
        }

        await this.calculateCartTotal(cart);
        return await cart.save();
    }

    static async clearCart(userId) {
        const cart = await Cart.findOne({ userId });
        cart.items = [];
        await this.calculateCartTotal(cart);
        return await cart.save();
    }

    static async deleteItem(userId, productId) {
        const cart = await Cart.findOne({ userId }).populate('items.product');
        cart.items = cart.items.filter(item => !item.product._id.equals(productId));
        await this.calculateCartTotal(cart);
        return await cart.save();
    }

    static async calculateCartTotal(cart) {
        console.log(cart.items);
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
}