import Fastify from "fastify";
import dotenv from "dotenv";
import { Database } from "./src/config/database.js";
import authMiddleware from "./src/middleware/auth.js";
import productsRoutes from "./src/routes/products.js";
import userRoutes from "./src/routes/users.js";
import cartRoutes from "./src/routes/cart.js";
import orderRoutes from "./src/routes/orders.js";
import webhookRoutes from "./src/routes/stripeWebhook.js";
import formbody from "@fastify/formbody";
import cors from "@fastify/cors";

dotenv.config();


const fastify = Fastify({
    logger: true,
});


async function bootstrap() {
    try { 
        
        await Database.connect();

        await fastify.register(cors, {
            origin: "*", 
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        });
        await fastify.register(formbody, {
            addHook: true,
            raw: true
        });
        await fastify.register(authMiddleware);

        
        fastify.get('/ping', async (request, reply) => {
            return { message: 'Welcome to the API' };
        });

        
        fastify.register(cartRoutes, { prefix: '/api/cart' });
        fastify.register(productsRoutes, { prefix: '/api/products' });
        fastify.register(userRoutes, { prefix: '/api/users' });
        fastify.register(orderRoutes, { prefix: '/api/orders' });
        fastify.register(webhookRoutes, { prefix: '/api/webhook' });
        const port = process.env.PORT || 3000;
        fastify.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 Server is running on port ${port}`);
    } catch (error) {
        console.error('Failed to bootstrap the application:', error);
        process.exit(1);
    }
}

bootstrap();
