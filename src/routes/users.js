import { UserController } from "../controllers/userController.js";
import { userSchema } from "../validators/userValidator.js";

async function userRoutes(fastify, options) {
    // fastify.get('/', {
    //     onRequest: [fastify.authenticate, fastify.requireAdmin],
    //     handler: UserController.getAllUsers,
    // });

    fastify.post('/register', {
        schema: userSchema.register,
        handler: UserController.registerUser,
    });

    fastify.post('/login', {
        schema: userSchema.login,
        handler: UserController.login,
    });

    fastify.get('/profile', {
        onRequest: [fastify.authenticate],
        handler: UserController.getProfile,
    });

    fastify.put('/profile', {
        schema: userSchema.updateProfile,
        handler: UserController.updateProfile,
    });
}

export default userRoutes;