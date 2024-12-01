import { UserService } from "../services/userServices.js";

export class UserController {
    static async registerUser(request, reply) {
        try {
            const result = await UserService.registerUser(request.body);
            reply.code(201).send(user);
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }

    static async login(request, reply) {
        try {
            const { email, password } = request.body;
            const result = await UserService.login(email, password);
            reply.code(200).send(result);
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }

    static async getProfile(request, reply) {
        try {
            const userId = request.user.userId;
            const user = await UserService.getProfile(userId);
            reply.code(200).send(user);
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }

    static async updateProfile(request, reply) {
        try {
            const userId = request.user.id;
            const user = await UserService.updateProfile(userId, request.body);
            reply.code(200).send(user);
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }
}