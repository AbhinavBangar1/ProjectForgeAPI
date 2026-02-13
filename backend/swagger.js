import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProjectForge API',
      version: '1.0.0',
      description: 'A scalable REST API for project and issue management with JWT authentication and role-based access control',
      contact: {
        name: 'API Support',
        email: 'support@projectforge.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://your-production-url.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Project ID'
            },
            title: {
              type: 'string',
              description: 'Project title'
            },
            description: {
              type: 'string',
              description: 'Project description'
            },
            owner_id: {
              type: 'string',
              description: 'ID of the project owner'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        Issue: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Issue ID'
            },
            title: {
              type: 'string',
              description: 'Issue title'
            },
            description: {
              type: 'string',
              description: 'Issue description'
            },
            status: {
              type: 'string',
              enum: ['open', 'in_progress', 'closed'],
              description: 'Issue status'
            },
            project_id: {
              type: 'string',
              description: 'Associated project ID'
            },
            assigned_to: {
              type: 'string',
              description: 'ID of assigned user'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
