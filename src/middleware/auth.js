import jwt from "jsonwebtoken";
import { CustomError } from "../utils/errors.js";

export default async function authMiddleware(fastify) {
    fastify.decorate('authenticate', async (request, reply, done) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) { 
                throw new CustomError("Unauthorized", 401);
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded;
            done();
        } catch (error) {
            reply.code(401).send({ error: 'Invalid or expired token'});
        }
    });

    fastify.decorate('requireAdmin', async (request, reply, done) => {
        if (request.user.role !== 'admin') {
            reply.code(403).send({ error: 'Forbidden'});
        }
        done();
    });
} 