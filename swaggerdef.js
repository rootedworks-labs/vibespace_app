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
        name: 'Users',
        description: 'Operations about users, profiles, and follows'
    },
    {
      name: 'Posts',
      description: 'Operations related to posts and interactions'
    },
    {
        name: 'Feed',
        description: 'Get the user\'s personalized content feed'
    },
    {
        name: 'Uploads',
        description: 'File upload operations'
    },
    {
        name: 'Consents',
        description: 'Managing user consents for GDPR compliance'
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
    // Auth Routes
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
    // User Routes
    '/api/users/me': {
        get: {
            tags: ['Users'],
            summary: 'Get current user profile',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': { description: 'Successful operation' },
                '401': { description: 'Unauthorized' }
            }
        },
        patch: {
            tags: ['Users'],
            summary: 'Update current user profile',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                username: { type: 'string', example: 'new_username' },
                                bio: { type: 'string', example: 'A short bio about me.' },
                                website: { type: 'string', example: 'https://example.com'}
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Profile updated successfully' },
                '400': { description: 'Invalid input' }
            }
        },
        delete: {
            tags: ['Users'],
            summary: 'Delete current user account',
            security: [{ bearerAuth: [] }],
            responses: {
                '204': { description: 'Account deleted successfully' },
                '401': { description: 'Unauthorized' }
            }
        }
    },
    '/api/users/me/avatar': {
        post: {
            tags: ['Users'],
            summary: 'Upload or update avatar',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                avatar: {
                                    type: 'string',
                                    format: 'binary'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Avatar updated successfully' },
                '400': { description: 'No file uploaded or invalid file type' }
            }
        }
    },
    '/api/users/{username}/follow': {
        post: {
            tags: ['Users'],
            summary: 'Follow a user',
            security: [{ bearerAuth: [] }],
            parameters: [{
                in: 'path',
                name: 'username',
                required: true,
                schema: { type: 'string' },
                description: 'The username of the user to follow'
            }],
            responses: {
                '201': { description: 'User followed successfully' },
                '404': { description: 'User not found' }
            }
        },
        delete: {
            tags: ['Users'],
            summary: 'Unfollow a user',
            security: [{ bearerAuth: [] }],
            parameters: [{
                in: 'path',
                name: 'username',
                required: true,
                schema: { type: 'string' },
                description: 'The username of the user to unfollow'
            }],
            responses: {
                '200': { description: 'User unfollowed successfully' },
                '404': { description: 'User not found' }
            }
        }
    },
    // Post Routes
    '/api/posts': {
        get: {
            tags: ['Posts'],
            summary: 'Get all posts',
            responses: {
                '200': { description: 'A list of posts' }
            }
        },
        post: {
            tags: ['Posts'],
            summary: 'Create a new post',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                content: { type: 'string', example: 'This is my first post!' },
                                is_public: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: {
                '201': { description: 'Post created successfully' }
            }
        }
    },
    '/api/posts/{postId}': {
        get: {
            tags: ['Posts'],
            summary: 'Get a single post by ID',
            parameters: [{
                in: 'path',
                name: 'postId',
                required: true,
                schema: { type: 'integer' },
                description: 'The ID of the post to retrieve'
            }],
            responses: {
                '200': { description: 'Successful operation' },
                '404': { description: 'Post not found' }
            }
        },
        delete: {
            tags: ['Posts'],
            summary: 'Delete a post',
            security: [{ bearerAuth: [] }],
            parameters: [{
                in: 'path',
                name: 'postId',
                required: true,
                schema: { type: 'integer' },
                description: 'The ID of the post to delete'
            }],
            responses: {
                '204': { description: 'Post deleted successfully' },
                '403': { description: 'Forbidden' }
            }
        }
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
      },
      // Feed Route
      '/api/feed': {
          get: {
              tags: ['Feed'],
              summary: 'Get the personalized activity feed for the current user',
              security: [{ bearerAuth: [] }],
              responses: {
                  '200': { description: 'A list of posts for the feed' },
                  '401': { description: 'Unauthorized' }
              }
          }
      },
      // Upload Route
      '/api/uploads': {
          post: {
              tags: ['Uploads'],
              summary: 'Upload a file',
              security: [{ bearerAuth: [] }],
              requestBody: {
                  required: true,
                  content: {
                      'multipart/form-data': {
                          schema: {
                              type: 'object',
                              properties: {
                                  file: {
                                      type: 'string',
                                      format: 'binary'
                                  }
                              }
                          }
                      }
                  }
              },
              responses: {
                  '200': { description: 'File uploaded successfully' },
                  '400': { description: 'No file uploaded' },
                  '403': { description: 'Consent required' }
              }
          }
      },
      // Consent Route
      '/api/consents': {
          post: {
              tags: ['Consents'],
              summary: 'Grant a consent type',
              security: [{ bearerAuth: [] }],
              requestBody: {
                  required: true,
                  content: {
                      'application/json': {
                          schema: {
                              type: 'object',
                              properties: {
                                  consent_type: { type: 'string', example: 'file_upload' }
                              }
                          }
                      }
                  }
              },
              responses: {
                  '201': { description: 'Consent granted successfully' },
                  '400': { description: 'consent_type is required' }
              }
          }
      }
  },
};

module.exports = swaggerDefinition;