export const cartSchema = {
    createCart: {
        body: {
            type: 'object',
            required: ['productId', 'quantity'],
            properties: {
                productId: { type: 'string'},
                quantity: { type: 'number', minimum: 1 },
            },
        },
    },
    updateQuantity: {
        body: {
            type: 'object',
            required: ['productId', 'quantity'],
            properties: {
                productId: { type: 'string' },
                quantity: { type: 'number', minimum: 0 },
            },
        },
    },
}