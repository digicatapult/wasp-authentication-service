import jwt from 'jwt-simple'
import moment from 'moment'
import validator from 'validator'
import env from './env.js'

const { JWT_SECRET } = env

moment.suppressDeprecationWarnings = true // suppress warning on parse error, this is why we are using moment!!

const isUuidInvalid = (uuid) => {
  return !uuid || !validator.isUUID(uuid)
}

const isExpiryDateInvalid = (date) => {
  let asMoment = typeof date === 'number' ? moment.unix(date) : moment(date)
  return !asMoment.isValid() || moment().isAfter(asMoment)
}

const decodeToken = (authHeader) => {
  const headerPrefix = 'Bearer '

  if (authHeader && authHeader.startsWith(headerPrefix)) {
    const token = authHeader.replace(headerPrefix, '')

    try {
      const result = jwt.decode(token, JWT_SECRET)

      return isExpiryDateInvalid(result.exp) ? null : result
    } catch (err) {
      return null
    }
  } else {
    return null
  }
}

const encodeToken = (id, userId, exp) => {
  if (isExpiryDateInvalid(exp)) {
    return null
  } else {
    const token = jwt.encode(
      {
        id,
        exp,
        sub: userId,
      },
      JWT_SECRET
    )

    return {
      token,
      sub: userId,
      exp,
    }
  }
}

export { isUuidInvalid, decodeToken, encodeToken }
