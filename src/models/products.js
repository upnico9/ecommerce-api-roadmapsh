import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const productSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = model("Product", productSchema);

export default Product;
