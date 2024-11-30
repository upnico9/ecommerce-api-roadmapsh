export const userSchema = {
    register: {
        body: {
            type: "object",
            required: ["firstName", "email", "password", "lastName"],
            properties: {
                firstName: { type: "string", minLength: 1, maxLength: 100},
                lastName: { type: "string", minLength: 1, maxLength: 100 },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8, maxLength: 100 },
                address: { type: "object", required: ["street", "city", "state", "zip"], 
                    properties: {
                        street: { type: "string", minLength: 1  },
                        city: { type: "string", minLength: 1  },
                        state: { type: "string", minLength: 1 },
                        zip: { type: "string", minLength: 1 },
                    },
                },
            },
        },
    },

    login: {
        body: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8, maxLength: 100 },
            },
        },
    },

    updateProfile: {
        body: {
            type: "object",
            properties: {
                firstName: { type: "string", minLength: 1, maxLength: 100 },
                lastName: { type: "string", minLength: 1, maxLength: 100 },
                address: { type: "object", required: ["street", "city", "state", "zip"], 
                    properties: {
                        street: { type: "string", minLength: 1  },
                        city: { type: "string", minLength: 1  },
                        state: { type: "string", minLength: 1 },
                        zip: { type: "string", minLength: 1 },
                    },
                },
            },
        },
    },
};