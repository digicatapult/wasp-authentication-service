module.exports = function (authenticationService) {
  const doc = {
    GET: async function (req, res) {
      const { authorization } = req.headers

      const { statusCode, result } = authenticationService.getTokenPayload(authorization)

      if (statusCode === 200) {
        res.set({ 'user-id': result.sub })
      }

      res.status(statusCode).json(result)
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get authorization token',
    responses: {
      200: {
        description: 'Return JWT',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/JWT',
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
    tags: ['auth'],
  }

  return doc
}
