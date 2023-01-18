import { isUuidInvalid } from '../../../../../validatorUtil.js'
export default function (authenticationService) {
  const doc = {
    DELETE: async function (req, res) {
      const { 'user-id': userIdHeader } = req.headers
      const { userId, tokenId } = req.params

      if (!isUuidInvalid(userIdHeader) && userIdHeader === userId) {
        const { authorization } = req.headers

        const { statusCode, result } = await authenticationService.deleteUserToken({
          authorization,
          userId,
          tokenId,
        })

        res.status(statusCode).json(result)
      } else {
        res.status(401).json({})
      }
    },
  }

  doc.DELETE.apiDoc = {
    summary: 'Revoke user token',
    parameters: [
      {
        description: 'userId who owns the token',
        in: 'path',
        required: true,
        name: 'userId',
        allowEmptyValue: true,
      },
      {
        description: 'Id of the token',
        in: 'path',
        required: true,
        name: 'tokenId',
        allowEmptyValue: true,
      },
    ],
    responses: {
      200: {
        description: 'Revoke user token',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Token',
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
