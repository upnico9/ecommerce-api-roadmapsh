import { productSchema } from "../validators/productValidator.js";
import { ProductsController } from "../controllers/productsController.js";

async function productsRoutes(fastify, options) {
    fastify.get('/', {
        handler: ProductsController.searchProducts,
    });

    fastify.get('/:id', {
        handler: ProductsController.getProductById,
    });

    fastify.post('/', {
        onRequest: [fastify.isAdmin],
        schema: productSchema.createProduct,
        handler: ProductsController.createProduct,
    });

    fastify.put('/:id', {
        onRequest: [fastify.isAdmin],
        schema: productSchema.updateProduct,
        handler: ProductsController.updateProduct,
    });

    fastify.delete('/:id', {
        onRequest: [fastify.isAdmin],
        handler: ProductsController.deleteProduct,
    });
}

export default productsRoutes;