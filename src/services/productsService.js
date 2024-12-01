import Product from "../models/products.js";

export class ProductsService {
    static async searchProducts(query) {
        const products = await Product.find({}, { id: 0, __v: 0 });

        return products
    }

    static async getProductById(id) {
        const product = await Product.findById(_id, { id: 0, __v: 0 });
        if (!product) {
            throw new CustomError("Product not found", 404);
        }
        return product;
    }

    static async createProduct(productData) {
        const existingProduct = await Product.findOne({ name: productData.name });
        if (existingProduct) {
            throw new CustomError("Product already exists", 400);
        }

        const product = new Product(productData);
        await product.save();
        return product;
    }

    static async updateProduct(id, productData) {
        const existingProduct = await Product.findOne({ name: productData.name });
        if (existingProduct) {
            throw new CustomError("Product already exists", 400);
        }
        return Product.findOneAndUpdate({ id }, {...productData, updatedAt: Date.now()}, { new: true, runValidators: true });
    }

    static async deleteProduct(id) {
        const existingProduct = await Product.findOne({ id });
        if (!existingProduct) {
            throw new CustomError("Product not found", 404);
        }
        return Product.deleteOne({ id });
    }
}