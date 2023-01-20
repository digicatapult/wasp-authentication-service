import env from '../env.js'

const { PORT, API_VERSION } = env

const apiDoc = {
  openapi: '3.0.3',
  info: {
    title: 'AuthenticationService',
    version: API_VERSION,
  },
  servers: [
    {
      url: `http://localhost:${PORT}/v1`,
    },
  ],
  components: {
    responses: {
      NotFoundError: {
        description: 'This resource cannot be found',
      },
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
      },
      Error: {
        description: 'Something went wrong',
      },
    },
    schemas: {
      Token: {
        type: 'object',
        properties: {
          id: {
            description: 'Id of the token',
            type: 'string',
          },
          name: {
            description: 'Name of the token',
            type: 'string',
          },
          revoked: {
            description: 'Revoked flag of the token',
            type: 'boolean',
          },
        },
        required: ['id', 'name', 'revoked'],
      },
      JWT: {
        type: 'object',
        properties: {
          sub: {
            description: 'Authorization token namespace',
            type: 'string',
          },
          exp: {
            description: 'Authorization token expiry timestamp',
            type: 'string',
          },
        },
        required: ['sub', 'exp'],
      },
      JWT_USER: {
        type: 'object',
        properties: {
          token: {
            description: 'Authorization token',
            type: 'string',
          },
          exp: {
            description: 'Authorization token expiry timestamp',
            type: 'string',
          },
        },
        required: ['token', 'exp'],
      },
    },
  },
  paths: {},
}

export default apiDoc
