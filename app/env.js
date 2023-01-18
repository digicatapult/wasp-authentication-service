import envalid from 'envalid'
import dotenv from 'dotenv'

import { version } from './version.js'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: 'test/test.env' })
} else {
  dotenv.config()
}

const vars = envalid.cleanEnv(
  process.env,
  {
    SERVICE_TYPE: envalid.str({ default: 'wasp-authentication-service'.toUpperCase().replace(/-/g, '_') }),
    LOG_LEVEL: envalid.str({ default: 'info', devDefault: 'debug' }),
    PORT: envalid.port({ default: 80, devDefault: 3000 }),
    API_VERSION: envalid.str({ default: version }),
    API_MAJOR_VERSION: envalid.str({ default: 'v1' }),
    JWT_SECRET: envalid.str({ devDefault: 'ogA9ppB$S!dy!hu3Rauvg!L96' }),
    DB_HOST: envalid.host({ devDefault: 'localhost' }),
    DB_PORT: envalid.port({ default: 5432 }),
    DB_NAME: envalid.str({ default: 'authentication' }),
    DB_USERNAME: envalid.str({ devDefault: 'postgres' }),
    DB_PASSWORD: envalid.str({ devDefault: 'postgres' }),
  },
  {
    strict: true,
  }
)

export default vars
