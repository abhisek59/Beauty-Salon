import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse Mongoose models to extract schemas
 */
function parseMongooseModels() {
    try {
        const modelsDir = path.join(__dirname, '../models');
        const models = {};
        
        // Define models manually based on your Mongoose schemas
        models.User = {
            properties: {
                firstname: { type: 'string' },
                lastname: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', format: 'password' },
                phone: { type: 'string' },
                avatar: { type: 'string' },
                role: { type: 'string', enum: ['customer', 'staff', 'admin'] },
                isVerified: { type: 'boolean' },
                isActive: { type: 'boolean' },
                experience: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            company: { type: 'string' },
                            duration: { type: 'string' },
                            description: { type: 'string' }
                        }
                    }
                },
                refreshToken: { type: 'string' },
                resetPasswordToken: { type: 'string' },
                resetPasswordExpires: { type: 'string', format: 'date-time' }
            },
            required: ['firstname', 'lastname', 'email', 'password', 'phone']
        };

        models.Service = {
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                duration: { type: 'number' },
                category: { type: 'string' },
                isActive: { type: 'boolean' },
                image: { type: 'string' }
            },
            required: ['name', 'price', 'duration']
        };

        models.Appointment = {
            properties: {
                customer: { type: 'string' },
                staff: { type: 'string' },
                service: { type: 'string' },
                appointmentDate: { type: 'string', format: 'date-time' },
                status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
                totalAmount: { type: 'number' },
                notes: { type: 'string' },
                paymentStatus: { type: 'string', enum: ['pending', 'paid', 'refunded'] }
            },
            required: ['customer', 'service', 'appointmentDate']
        };

        models.Transaction = {
            properties: {
                appointment: { type: 'string' },
                customer: { type: 'string' },
                amount: { type: 'number' },
                paymentMethod: { type: 'string', enum: ['cash', 'card', 'paypal', 'online'] },
                paymentStatus: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
                transactionId: { type: 'string' },
                paypalPaymentId: { type: 'string' },
                description: { type: 'string' }
            },
            required: ['customer', 'amount', 'paymentMethod']
        };

        models.DailySales = {
            properties: {
                date: { type: 'string', format: 'date' },
                totalSales: { type: 'number' },
                totalAppointments: { type: 'number' },
                totalTransactions: { type: 'number' },
                paymentBreakdown: {
                    type: 'object',
                    properties: {
                        cash: { type: 'number' },
                        card: { type: 'number' },
                        paypal: { type: 'number' },
                        online: { type: 'number' }
                    }
                }
            },
            required: ['date', 'totalSales']
        };
        
        return models;
    } catch (error) {
        console.warn('Could not parse Mongoose models:', error.message);
        return {};
    }
}

/**
 * Parse route comments for Swagger documentation
 */
function parseRouteComments(routesDir) {
    const paths = {};
    const tags = new Set();
    
    try {
        const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.routes.js'));
        
        routeFiles.forEach(file => {
            const filePath = path.join(routesDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract tag from filename
            const tag = file.replace('.routes.js', '');
            tags.add(tag);
            
            // Enhanced route parsing for your router structure
            const routeRegex = /Router\(\)\s*\.route\(['"`]([^'"`]+)['"`]\)\s*\.(get|post|put|delete|patch)\(/g;
            let match;
            
            while ((match = routeRegex.exec(content)) !== null) {
                const route = match[1];
                const method = match[2].toLowerCase();
                const fullPath = `/api/v1/${tag}${route}`;
                
                if (!paths[fullPath]) {
                    paths[fullPath] = {};
                }
                
                paths[fullPath][method] = {
                    tags: [tag],
                    summary: `${method.toUpperCase()} ${fullPath}`,
                    responses: {
                        '200': {
                            description: 'Success',
                            content: {
                                'application/json': {
                                    schema: { type: 'object' }
                                }
                            }
                        },
                        '400': { description: 'Bad Request' },
                        '401': { description: 'Unauthorized' },
                        '404': { description: 'Not Found' },
                        '500': { description: 'Internal Server Error' }
                    }
                };
                
                // Add request body for POST, PUT, PATCH
                if (['post', 'put', 'patch'].includes(method)) {
                    paths[fullPath][method].requestBody = {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { type: 'object' }
                            }
                        }
                    };
                }
                
                // Add path parameters for routes with params
                if (route.includes(':')) {
                    const params = route.match(/:(\w+)/g);
                    if (params) {
                        paths[fullPath][method].parameters = params.map(param => ({
                            name: param.substring(1),
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            description: `${param.substring(1)} parameter`
                        }));
                    }
                }
                
                // Add authentication requirement for protected routes
                if (content.includes('verifyJWT') || content.includes('verifyAdmin')) {
                    paths[fullPath][method].security = [{ bearerAuth: [] }];
                }
            }
        });
    } catch (error) {
        console.warn('Could not parse route files:', error.message);
    }
    
    return { paths, tags: Array.from(tags) };
}

/**
 * Set up Swagger documentation
 */
function setupSwagger(app) {
    // Parse Mongoose models to get schemas
    const mongooseModels = parseMongooseModels();

    // Parse route comments
    const routesDir = path.join(__dirname, '../routes');
    const { paths, tags } = parseRouteComments(routesDir);

    // Generate schemas section from Mongoose models
    const schemas = {};
    Object.keys(mongooseModels).forEach(modelName => {
        const model = mongooseModels[modelName];
        schemas[modelName] = {
            type: 'object',
            properties: model.properties,
            required: model.required
        };

        // Add special case for register and login
        if (modelName === 'User') {
            schemas['UserRegister'] = {
                type: 'object',
                properties: {
                    firstname: { type: 'string' },
                    lastname: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' },
                    phone: { type: 'string' },
                    role: { type: 'string', enum: ['customer', 'staff', 'admin'] }
                },
                required: ['firstname', 'lastname', 'email', 'password', 'phone']
            };

            schemas['UserLogin'] = {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' }
                },
                required: ['email', 'password']
            };

            schemas['ChangePassword'] = {
                type: 'object',
                properties: {
                    oldPassword: { type: 'string', format: 'password' },
                    newPassword: { type: 'string', format: 'password' }
                },
                required: ['oldPassword', 'newPassword']
            };
        }

        // Add Appointment schemas
        if (modelName === 'Appointment') {
            schemas['AppointmentCreate'] = {
                type: 'object',
                properties: {
                    customer: { type: 'string' },
                    staff: { type: 'string' },
                    service: { type: 'string' },
                    appointmentDate: { type: 'string', format: 'date-time' },
                    notes: { type: 'string' }
                },
                required: ['customer', 'service', 'appointmentDate']
            };
        }

        // Add Payment schemas
        if (modelName === 'Transaction') {
            schemas['PaymentCreate'] = {
                type: 'object',
                properties: {
                    appointment: { type: 'string' },
                    amount: { type: 'number' },
                    paymentMethod: { type: 'string', enum: ['cash', 'card', 'paypal', 'online'] },
                    description: { type: 'string' }
                },
                required: ['appointment', 'amount', 'paymentMethod']
            };
        }
    });

    // Create tag definitions
    const tagDefinitions = tags.map(tag => ({
        name: tag,
        description: `Operations related to ${tag}`
    }));

    // Swagger JSDoc options
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Palor - Salon Management API',
                version: '1.0.0',
                description: 'API documentation for the Palor Salon Management System built with Node.js, Express, and MongoDB. This API provides endpoints for managing salon appointments, services, payments, users, and analytics.',
                contact: {
                    name: 'API Support',
                    email: 'support@palor.com'
                },
                license: {
                    name: 'MIT',
                    url: 'https://opensource.org/licenses/MIT'
                }
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || 8000}`,
                    description: 'Development server'
                },
                {
                    url: 'https://your-production-url.com',
                    description: 'Production server'
                }
            ],
            tags: tagDefinitions,
            paths,
            components: {
                schemas,
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Enter JWT token'
                    }
                },
                parameters: {
                    id: {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Resource ID'
                    }
                }
            }
        },
        apis: [
            path.join(__dirname, '../routes/*.js'),
            path.join(__dirname, '../controllers/*.js')
        ]
    };

    // Generate specification
    const swaggerSpec = swaggerJsdoc(options);

    // Swagger UI options
    const swaggerOptions = {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true
        },
        customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .info .title { color: #3b82f6 }
        `,
        customSiteTitle: 'Palor - Salon Management API Documentation'
    };

    // Serve Swagger docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
    console.log(`📚 Swagger docs available at http://localhost:${process.env.PORT || 8000}/api-docs`);
}

export default setupSwagger;