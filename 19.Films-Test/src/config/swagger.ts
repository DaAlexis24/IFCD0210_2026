import swaggerJSDoc, {type Options} from 'swagger-jsdoc';




const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Films API',
            version: '1.0.0',
            description: 'Express API for managing films and users',
            contact: {
                name: 'Your Name',
                email: 'your.email@example.com'
            },
            server: [
                {
                    url: 'http://localhost:3000/api',
                    description: 'Development server'
                }
            ], 
        }, 
    },
    apis: ['./src/**/router/*.ts'] // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
