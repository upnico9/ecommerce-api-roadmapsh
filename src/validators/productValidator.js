export const productSchema = {
    createProduct: {
        body: {
            type: "object",
            required: ["name", "description", "category", "image", "price", "stock"],
            properties: {
                name: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                image: { type: "string" },
                price: { type: "number" },
                stock: { type: "number" },
            }
        }
    },
    updateProduct: {
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                image: { type: "string" },
                price: { type: "number" },
                stock: { type: "number" },
            }
        }
    }
}