// In swaggerdef.js

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'VibeSpace API',
    version: '1.0.0',
    description: 'The official API documentation for the VibeSpace social platform.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'User authentication and authorization'
    },
    {
      name: 'Posts',
      description: 'Operations related to posts and interactions'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'testuser' },
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Created' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log out a user',
        requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
        responses: {
          '204': { description: 'No Content' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh an access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/api/posts/{postId}/like': {
        post: {
          tags: ['Posts'],
          summary: 'Like a post',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'postId',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'The ID of the post to like'
            }
          ],
          responses: {
            '201': { description: 'Post liked successfully' },
            '404': { description: 'Post not found' }
          }
        },
        delete: {
            tags: ['Posts'],
            summary: 'Unlike a post',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                in: 'path',
                name: 'postId',
                required: true,
                schema: {
                  type: 'integer'
                },
                description: 'The ID of the post to unlike'
              }
            ],
            responses: {
              '200': { description: 'Post unliked successfully' },
              '404': { description: 'Like not found' }
            }
          }
      }
  },
};

module.exports = swaggerDefinition;