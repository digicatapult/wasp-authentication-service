const { v4: uuidv4 } = require('uuid')

const { decodeToken, encodeToken, isUuidInvalid } = require('../../validatorUtil')
const { findUserTokens, addUserToken, revokeUserToken, validateCreateUserToken } = require('../../db')

function getTokenPayload(authHeader) {
  const result = decodeToken(authHeader)

  if (!result) {
    return { statusCode: 401, result: { error: 'Unauthorised' } }
  } else {
    return { statusCode: 200, result }
  }
}

async function getUserTokens({ userId }) {
  const result = await findUserTokens({ userId })

  return { statusCode: 200, result }
}

async function postUserToken({ userId, name, expiry }) {
  if (await validateCreateUserToken({ name, expiry })) {
    const id = uuidv4()
    const result = encodeToken(id, userId, expiry)

    await addUserToken({ id, name, userId, token: result.token })

    return { statusCode: 201, result: { token: result.token, exp: result.exp } }
  } else {
    return { statusCode: 400, result: {} }
  }
}

async function deleteUserToken({ tokenId }) {
  if (!isUuidInvalid(tokenId)) {
    const { statusCode, result } = await revokeUserToken({ tokenId })

    return { statusCode, result }
  } else {
    return { statusCode: 400, result: {} }
  }
}

module.exports = {
  getTokenPayload,
  getUserTokens,
  postUserToken,
  deleteUserToken,
}
