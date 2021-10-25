const knex = require('knex')
const bcrypt = require('bcrypt')
const moment = require('moment')

const env = require('./env')

const client = knex({
  client: 'pg',
  migrations: {
    tableName: 'migrations',
  },
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
})

const addUserToken = async ({ id, name, userId, token }) => {
  const tokenHash = await bcrypt.hash(token, 10)

  return client('user_tokens').insert({ id, name, user_id: userId, token_hash: tokenHash })
}

const findUserTokens = async ({ userId }) => {
  return client('user_tokens')
    .select(['id', 'name', 'revoked'])
    .where({ user_id: userId, revoked: false })
    .orderBy('updated_at', 'DESC')
}

const revokeUserToken = async ({ tokenId }) => {
  const result = await client('user_tokens')
    .update({ updated_at: new Date().toISOString(), revoked: true })
    .where({ id: tokenId })
    .returning(['id', 'name', 'revoked'])

  if (result.length === 0) {
    return { statusCode: 404, result: {} }
  } else if (result.length === 1) {
    return { statusCode: 200, result: result[0] }
  }

  return { statusCode: 500, result: {} }
}

const validateCreateUserToken = async ({ name, expiry }) => {
  return name && name.length > 0 && moment.unix(expiry).isValid() && moment.unix(expiry).isAfter(Date.now())
}

module.exports = {
  client,
  addUserToken,
  findUserTokens,
  validateCreateUserToken,
  revokeUserToken,
}
