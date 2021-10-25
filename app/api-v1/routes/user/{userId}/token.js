const { isUuidInvalid } = require('../../../../validatorUtil')
module.exports = function (authenticationService) {
  const doc = {
    GET: async function (req, res) {
      const { 'user-id': userIdHeader } = req.headers
      const { userId } = req.params

      if (!isUuidInvalid(userIdHeader) && userIdHeader === userId) {
        const { statusCode, result } = await authenticationService.getUserTokens({
          userId,
        })

        res.status(statusCode).json(result)
      } else {
        res.status(401).json({})
      }
    },
    POST: async function (req, res) {
      const { 'user-id': userIdHeader } = req.headers
      const { userId } = req.params

      if (!isUuidInvalid(userIdHeader) && userIdHeader === userId) {
        const { name, expiry } = req.body

        const { statusCode, result } = await authenticationService.postUserToken({ userId, name, expiry })

        res.status(statusCode).json(result)
      } else {
        res.status(401).json({})
      }
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get user tokens',
    parameters: [
      {
        description: 'userId of the token',
        in: 'path',
        required: true,
        name: 'userId',
        allowEmptyValue: true,
      },
    ],
    responses: {
      200: {
        description: 'Return user tokens',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Token',
              },
            },
          },
        },
      },
      401: {
        description: 'An unauthorized error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/UnauthorizedError',
            },
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    tags: ['user-token'],
  }

  doc.POST.apiDoc = {
    summary: 'Create user token',
    parameters: [
      {
        description: 'userId of the token',
        in: 'path',
        required: true,
        name: 'userId',
        allowEmptyValue: true,
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              expiry: {
                type: 'number',
              },
            },
            required: ['name', 'expiry'],
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create user token',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/JWT_USER',
            },
          },
        },
      },
      401: {
        description: 'Unauthorised request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/UnauthorizedError',
            },
          },
        },
      },
      404: {
        description: 'Resource does not exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    tags: ['user-token'],
  }

  return doc
}
