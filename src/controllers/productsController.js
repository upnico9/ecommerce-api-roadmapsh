import { ProductsService } from "../services/productsService.js";

export class ProductsController {
    static async searchProducts(request, reply) {
        try  {
            const query = request.query;
            const products = await ProductsService.searchProducts(query);
            reply.code(200).send(products);
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }

    static async getProductById(request, reply) {
        try {
            const id = request.params.id;
            const product = await ProductsService.getProductById(id);
            reply.code(200).send(product);
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }

    static async createProduct(request, reply) {
        try {
            const productData = request.body;
            const product = await ProductsService.createProduct(productData);
            reply.code(201).send(product);
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }

    static async updateProduct(request, reply) {
        try {
            const id = request.params.id;
            const productData = request.body;
            const product = await ProductsService.updateProduct(id, productData);
            reply.code(200).send(product);
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }

    static async deleteProduct(request, reply) {
        try {
            const id = request.params.id;
            await ProductsService.deleteProduct(id);
            reply.code(204).send();
        } catch (error) {
            reply.code(error.statusCode || 500).send({ error: error.message });
        }
    }
}