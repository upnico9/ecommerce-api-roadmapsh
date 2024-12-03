import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
    static async connect() {
        try {
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            };

            console.log(process.env.MONGO_DB_URI);

            await mongoose.connect(process.env.MONGO_DB_URI, options);
            console.log('📦 Connected to MongoDB successfully');

            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('MongoDB disconnected');
            });

            process.on('SIGINT', async () => {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            });

        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }
}