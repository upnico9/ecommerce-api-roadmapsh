import { StripeWebhookService } from "../services/stripeWebhookService.js";
import stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export default function stripeWebhookRoutes(fastify, options) {
    fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
        try {
            done(null, body);
        } catch (err) {
            err.statusCode = 400;
            done(err, undefined);
        }
    });

    fastify.post('/', {
        handler: async (request, reply) => {
            console.log('Webhook received');
            console.log(request.body);
            const signature = request.headers['stripe-signature'];
            try {
                const event = stripe.webhooks.constructEvent(
                    request.body,
                    signature,
                    process.env.STRIPE_WEBHOOK_SECRET
                );

                await StripeWebhookService.handleWebhook(event);
                reply.code(200).send({ received: true });
            } catch (error) {
                console.error('Webhook error:', error);
                reply.code(400).send(`Webhook Error: ${error.message}`);
            }
        }
    });
}