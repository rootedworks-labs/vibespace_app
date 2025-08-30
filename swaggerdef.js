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
    },
    {
        name: 'Notifications',
        description: 'Managing user notifications'
    },
    {
        name: 'Conversations',
        description: 'Real-time messaging between users'
    },
    {
        name: 'Waitlist',
        description: 'Waitlist subscription'
    },
    {
        name: 'Reports',
        description: 'Content reporting for moderation'
    },
    {
        name: 'Admin',
        description: 'Administrative operations'
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
    '/api/users/search': {
        get: {
            tags: ['Users'],
            summary: 'Search for users by username',
            security: [{ bearerAuth: [] }],
            parameters: [{
              in: 'query',
              name: 'q',
              required: true,
              schema: { type: 'string' },
              description: 'The search query for the username'
            }],
            responses: {
              '200': { description: 'A list of matching users' },
              '401': { description: 'Unauthorized' }
            }
        }
    },
    '/api/users/me/data': {
        get: {
            tags: ['Users'],
            summary: 'Export all data for the current user',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': { description: 'A JSON file with all user data' },
                '401': { description: 'Unauthorized' }
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
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                content: { type: 'string', example: 'This is my first post!' },
                                is_public: { type: 'boolean', example: true },
                                media: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'Optional image file for the post'
                                }
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
    '/api/posts/{postId}/vibe': {
      post: {
        tags: ['Posts'],
        summary: 'Give a vibe to a post',
        description: "Give a specific vibe to a post. A user can only have one vibe per post. If a vibe already exists from the user, this will update it to the new type (e.g., changing from 'energy' to 'fire').",
        security: [{ bearerAuth: [] }],
        parameters: [{
          in: 'path',
          name: 'postId',
          required: true,
          schema: { type: 'integer' },
          description: 'The ID of the post to give a vibe to'
        }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['vibe_type'],
                properties: {
                  vibe_type: {
                    type: 'string',
                    example: 'energy',
                    description: "The type of vibe (e.g., 'energy', 'flow', 'fire')."
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Vibe added or updated successfully.' },
          '404': { description: 'Post not found.' }
        }
      },
      delete: {
        tags: ['Posts'],
        summary: 'Remove a vibe from a post',
        security: [{ bearerAuth: [] }],
        parameters: [{
          in: 'path',
          name: 'postId',
          required: true,
          schema: { type: 'integer' },
          description: 'The ID of the post to remove the vibe from'
        }],
        responses: {
          '200': { description: 'Vibe removed successfully.' },
          '404': { description: 'Vibe not found for this user on this post.' }
        }
      }
    },
    '/api/posts/{postId}/comments': {
        get: {
          tags: ['Posts'],
          summary: 'Get all comments for a post',
          parameters: [{
            in: 'path',
            name: 'postId',
            required: true,
            schema: { type: 'integer' },
            description: 'The ID of the post'
          }],
          responses: {
            '200': { description: 'A list of comments' },
            '404': { description: 'Post not found' }
          }
        },
        post: {
          tags: ['Posts'],
          summary: 'Create a new comment on a post',
          security: [{ bearerAuth: [] }],
          parameters: [{
            in: 'path',
            name: 'postId',
            required: true,
            schema: { type: 'integer' },
            description: 'The ID of the post to comment on'
          }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    content: { type: 'string', example: 'Great post!' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Comment created successfully' },
            '404': { description: 'Post not found' }
          }
        }
      },
      '/api/posts/comments/{commentId}': {
        delete: {
          tags: ['Posts'],
          summary: 'Delete a comment',
          security: [{ bearerAuth: [] }],
          parameters: [{
            in: 'path',
            name: 'commentId',
            required: true,
            schema: { type: 'integer' },
            description: 'The ID of the comment to delete'
          }],
          responses: {
            '204': { description: 'Comment deleted successfully' },
            '403': { description: 'Forbidden' },
            '404': { description: 'Comment not found' }
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
      },
      // Notification Routes
      '/api/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'Get all notifications for the current user',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'A list of notifications' },
            '401': { description: 'Unauthorized' }
          }
        }
      },
      '/api/notifications/read': {
        patch: {
          tags: ['Notifications'],
          summary: 'Mark all notifications as read',
          security: [{ bearerAuth: [] }],
          responses: {
            '204': { description: 'Notifications marked as read' },
            '401': { description: 'Unauthorized' }
          }
        }
      },
      // Conversation Routes
      '/api/conversations': {
        post: {
          tags: ['Conversations'],
          summary: 'Start a new conversation',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    recipientId: { type: 'integer', description: 'The ID of the user to start a conversation with' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Conversation created' },
            '200': { description: 'Conversation already exists' }
          }
        },
        get: {
          tags: ['Conversations'],
          summary: 'Get all conversations for the current user',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'A list of conversations' }
          }
        }
      },
      '/api/conversations/{conversationId}/messages': {
        get: {
          tags: ['Conversations'],
          summary: 'Get all messages for a conversation',
          security: [{ bearerAuth: [] }],
          parameters: [{
            in: 'path',
            name: 'conversationId',
            required: true,
            schema: { type: 'integer' },
            description: 'The ID of the conversation'
          }],
          responses: {
            '200': { description: 'A list of messages' },
            '403': { description: 'Forbidden' }
          }
        },
        post: {
          tags: ['Conversations'],
          summary: 'Send a message in a conversation',
          security: [{ bearerAuth: [] }],
          parameters: [{
            in: 'path',
            name: 'conversationId',
            required: true,
            schema: { type: 'integer' },
            description: 'The ID of the conversation'
          }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    content: { type: 'string', example: 'Hello there!' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Message sent' },
            '403': { description: 'Forbidden' }
          }
        }
      },
      // Waitlist Route
      '/api/waitlist': {
        post: {
          tags: ['Waitlist'],
          summary: 'Subscribe an email to the waitlist',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email', example: 'new.user@example.com' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Successfully subscribed' },
            '200': { description: 'Email was already subscribed' }
          }
        }
      },
      // Reports Route
      '/api/reports': {
        post: {
          tags: ['Reports'],
          summary: 'Create a new report for a piece of content',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    reported_content_type: { type: 'string', enum: ['post', 'comment'], example: 'post' },
                    reported_id: { type: 'integer', description: 'The ID of the content being reported' },
                    reason: { type: 'string', example: 'This content is inappropriate.' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Report created successfully' },
            '400': { description: 'Invalid input or content type' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Content to report not found' }
          }
        }
      },
      // Admin Route
      '/api/admin/reports': {
        get: {
          tags: ['Admin'],
          summary: 'Get all open reports for admin review',
          description: 'Requires admin role.',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'A list of open reports' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Forbidden - User is not an admin' }
          }
        }
      }
  },
};

module.exports = swaggerDefinition;