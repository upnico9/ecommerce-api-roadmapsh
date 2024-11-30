import { userSchema } from "../utils/validation.js";
import { UserService } from "../services/userServices.js";

async function userRoutes(fastify, options) {
    fastify.get('/', {
        onRequest: [fastify.requireAdmin],
        handler: UserService.getAllUsers,
    });

    fastify.post('/register', {
        schema: userSchema.register,
        handler: UserService.registerUser,
    });

    fastify.post('/login', {
        schema: userSchema.login,
        handler: UserService.loginUser,
    });

    fastify.get('/profile', {
        onRequest: [fastify.authenticate],
        handler: UserService.getProfile,
    });

    fastify.put('/profile', {
        schema: userSchema.updateProfile,
        handler: UserService.updateProfile,
    });
}

export default userRoutes;