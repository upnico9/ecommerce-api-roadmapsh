import Cart from "../models/cart.js";

export class CartService {
    static async getCart(userId) {
        let cart = await Cart.findOne({ userId }).populate('items.product');
    }

    static async createCart(userId, productId) {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.product._id.equals(productId));

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ product: productId, quantity: 1 });
        }

        await this.calculateCartTotal(cart);
        return await cart.save();
    }

    static async updateQuantity(userId, productId, quantity) {
        const cart = await Cart.findOne({ userId });
        const item = cart.items.find(item => item.product._id.equals(productId));
        if (!item) {
            throw new Error('Item not found in cart');
        }
        item.quantity = quantity;
        await this.calculateCartTotal(cart);
        return await cart.save();
    }


    static async deleteItem(userId, productId) {
        const cart = await Cart.findOne({ userId });
        cart.items = cart.items.filter(item => !item.product._id.equals(productId));
        await this.calculateCartTotal(cart);
        return await cart.save();
    }

    static async calculateCartTotal(cart) { 
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
}