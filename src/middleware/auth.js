import jwt from "jsonwebtoken";
import { CustomError } from "../utils/errors.js";
import fp from "fastify-plugin";
import dotenv from "dotenv";

dotenv.config();

async function authMiddleware(fastify) {
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) { 
                throw new CustomError("Unauthorized", 401);
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded;
        } catch (error) {
            reply.code(401).send({ error: 'Invalid or expired token'});
        }
    });

    fastify.decorate('requireAdmin', async (request, reply) => {
        console.log(request.user);
        if (request.user.role !== 'admin') {
            reply.code(403).send({ error: 'Forbidden'});
        }
    });
} 

export default fp(authMiddleware);