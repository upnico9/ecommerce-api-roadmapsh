import User from "../models/users.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/errors.js";
import dotenv from "dotenv";

dotenv.config();

export class UserService {

    static async registerUser(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new CustomError("User already exists", 400);
        }
        const user = new User(userData);
        await user.save();

        const token = this.generateToken(user._id, user.role);
        return { user, token };
    }

    static async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError("Invalid email", 400);
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new CustomError("Invalid password", 400);
        }
    
        const token = this.generateToken(user);
        return { user: this.sanitizeUser(user), token };
    }

    static async getProfile(userId) {
        const user = await User.findById(userId);
        console.log(user);
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        return this.sanitizeUser(user);
    }

    static async updateProfile(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            {...updateData, updatedAt: Date.now()},
            {new: true}
        );
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        return this.sanitizeUser(user);
    }

    static async getAllUsers() {
        const users = await User.find();
        return users.map(this.sanitizeUser);
    }

    static generateToken(user) {
        return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    }

    static sanitizeUser(user) {
        const sanitized = user.toObject();
        delete sanitized.__v;
        delete sanitized.password;
        return sanitized;
    }
}