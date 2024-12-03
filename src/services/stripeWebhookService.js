import Order from "../models/orders.js";
import { CustomError } from "../utils/errors.js";
import { CartService } from "./cartService.js";

export class StripeWebhookService {
    static async handleWebhook(event) {
        console.log('Webhook received fom stripe :' + event.type);
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSuccess(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailure(event.data.object);
                break;
        }
    }

    static async handlePaymentSuccess(paymentIntent) {
        console.log('Payment success:', paymentIntent);
        const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
        if (!order) {
            throw new CustomError('Order not found', 404);
        }
        order.status = 'confirmed';
        await order.save();

        console.log('Order confirmed:', order);

        await CartService.clearCart(order.user);
        console.log('Cart cleared');

    }

    static async handlePaymentFailure(paymentIntent) {
        console.log('Payment failed:', paymentIntent);
        const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
        if (!order) {
            throw new CustomError('Order not found', 404);
        }

        order.status = 'cancelled';
        await order.save();
    }
}