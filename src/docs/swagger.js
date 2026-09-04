import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env.js';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3', info: { title: 'Multimedia Upload & Search API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${env.port}/api`, description: 'Local API' }],
    components: { schemas: {
      File: { type: 'object', properties: { _id: { type: 'string' }, originalName: { type: 'string' }, url: { type: 'string' }, resourceType: { type: 'string' }, mimeType: { type: 'string' }, size: { type: 'number' }, tags: { type: 'array', items: { type: 'string' } }, viewCount: { type: 'integer' }, relevanceScore: { type: 'number' } } }
    }, securitySchemes: { cookieAuth: { type: 'apiKey', in: 'cookie', name: 'access_token' } } },
    security: [{ cookieAuth: [] }]
  },
  apis: ['./src/docs/openapi.js']
});
