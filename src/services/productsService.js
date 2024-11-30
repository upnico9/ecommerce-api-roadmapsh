import Product from "../models/products.js";

export class ProductsService {
    static async searchProducts(query) {
        return Product.find({ $text: { $search: query } }, { _id: 0, __v: 0 });
    }

    static async getProductById(id) {
        return Product.findOne({ id }, { _id: 0, __v: 0 });
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