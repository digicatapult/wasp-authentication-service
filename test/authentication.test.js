import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import jwt from 'jwt-simple'
import moment from 'moment'

import env from '../app/env.js'
import { setupServer } from './helpers/server.js'
import { setupDb } from './helpers/db.js'

const { JWT_SECRET } = env

describe('authentication service - validate token', function () {
  const context = {}

  setupServer(context)
  setupDb(context)

  beforeEach(async function () {
    await context.db('user_tokens').del()
  })

  describe('validate auth tokens', function () {
    it('should return 200 using valid Swagger UI header and JWT', async function () {
      const sub = 'foo/uuid'
      const exp = moment().add('1', 'hour').unix()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('Authorization', `Bearer ${token}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.deep.equal({ sub, exp })
      expect(context.response.header['user-id']).to.equal(sub)
    })

    it('should return 200 using valid Swagger UI header and JWT with ISO string exp', async function () {
      const sub = 'foo/uuid'
      const exp = moment().add('1', 'hour').toISOString()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('Authorization', `Bearer ${token}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.deep.equal({ sub, exp })
      expect(context.response.header['user-id']).to.equal(sub)
    })

    it('should return 401 using valid Swagger UI header and a malformed JWT', async function () {
      const sub = 'foo/uuid'
      const exp = 'not a date'
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('Authorization', `Bearer ${token}`)

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })

    it('should return 200 using valid Swagger UI header and JWT - lowercase header name', async function () {
      const sub = 'foo/uuid'
      const exp = moment().add('1', 'hour').unix()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('authorization', `Bearer ${token}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.deep.equal({ sub, exp })
      expect(context.response.header['user-id']).to.equal(sub)
    })

    it('should return 401 using valid Swagger UI header and a malformed JWT - lowercase header name', async function () {
      const sub = 'foo/uuid'
      const exp = 'not a date'
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('authorization', `Bearer ${token}`)

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })

    it('should return 401 (invalid Swagger UI auth header)', async function () {
      const sub = 'foo/uuid'
      const exp = moment().add('1', 'hour').toISOString()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('security', `Bearer ${token}Bearer `)

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })

    it('should return 401 (invalid Swagger UI auth header)', async function () {
      const sub = 'foo/uuid'
      const exp = moment().add('1', 'hour').toISOString()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('Authorization', `Bearer${token}`)

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })

    it('should return 401 (invalid Swagger UI auth header)', async function () {
      const sub = 'foo/uuid'
      const exp = moment().add('1', 'hour').toISOString()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('Authorization', `${token}Bearer `)

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })

    it('should return 401 (missing Swagger UI auth header)', async function () {
      context.response = await context.request.get('/v1/auth')

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })

    it('should return 401 (invalid JWT expiry - now)', async function () {
      const sub = 'foo/uuid'
      const exp = moment().toISOString()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('Authorization', `Bearer ${token}`)

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })

    it('should return 401 (invalid JWT expiry - 1 hour ago)', async function () {
      const sub = 'foo/uuid'
      const exp = moment().subtract('1', 'hour').toISOString()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('Authorization', `Bearer ${token}`)

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })

    it('should return 401 (invalid JWT expiry - epoch)', async function () {
      const sub = 'foo/uuid'
      const exp = moment().unix()
      const token = jwt.encode({ sub, exp }, JWT_SECRET)

      context.response = await context.request.get('/v1/auth').set('Authorization', `Bearer ${token}`)

      expect(context.response.status).to.equal(401)
      expect(context.response.body).to.deep.equal({ error: 'Unauthorised' })
      expect(context.response.header).to.not.haveOwnProperty('user-id')
    })
  })

  describe('User tokens', function () {
    // valid
    const validExpiry = moment().add('1', 'hour').unix()
    const validUserId = 'ed4b3481-cd8d-43b6-a8f1-8a8d2fbdb242'
    const validNameOne = 'userDesktopOne'
    // invalid
    const invalidId = '00000000-0000-0000-0000-000000000000'

    beforeEach(async function () {
      await context.db('user_tokens').del()
    })

    describe('POST user tokens', function () {
      it('should add user token and return 201 using valid user token', async function () {
        context.response = await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(201)
        expect(context.response.body).to.have.property('token')
        expect(context.response.body).to.have.property('exp')
        expect(context.response.body.sub).to.equal(undefined)
      })

      it('should add user token and return 401 using invalid user id header', async function () {
        context.response = await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', invalidId)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should add user token and return 401 using invalid user id header', async function () {
        context.response = await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', 0)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should return 401 using invalid user id', async function () {
        context.response = await context.request
          .post('/v1/user/0/token')
          .send({ name: '', expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should return 401 using invalid user id', async function () {
        context.response = await context.request
          .post(`/v1/user/${invalidId}/token`)
          .send({ name: '', expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should return 400 using expired auth token', async function () {
        const invalidExpiry = moment().subtract('1', 'hour').unix()

        context.response = await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: invalidExpiry })
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(400)
        expect(context.response.body).to.deep.equal({})
      })

      it('should return 400 using invalid name', async function () {
        const invalidExpiry = moment().add('1', 'hour').unix()

        context.response = await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: '', expiry: invalidExpiry })
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(400)
        expect(context.response.body).to.deep.equal({})
      })
    })

    describe('GET user tokens', function () {
      it('should list user tokens and return 200 using valid Swagger UI header and JWT', async function () {
        const expectedResult = [{ name: validNameOne, revoked: false }]

        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        context.response = await context.request.get(`/v1/user/${validUserId}/token`).set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(200)

        expect(context.response.body.length).to.equal(expectedResult.length)
        expect(context.response.body[0]).to.have.property('id')
        expect(context.response.body[0].name).to.equal(expectedResult[0].name)
        expect(context.response.body[0].revoked).to.equal(expectedResult[0].revoked)
      })

      it('should list user tokens and return 401 using invalid user id header', async function () {
        context.response = await context.request.get(`/v1/user/${validUserId}/token`).set('user-id', invalidId)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should list user tokens and return 401 using invalid user id header', async function () {
        context.response = await context.request.get(`/v1/user/${validUserId}/token`).set('user-id', 0)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should return 401 using expired token', async function () {
        const invalidExpiry = moment().subtract('1', 'hour').unix()

        context.response = await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: invalidExpiry })
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(400)
        expect(context.response.body).to.deep.equal({})
      })

      it('should add and list user tokens and return 401 using invalid user id', async function () {
        context.response = await context.request.get('/v1/user/0/token').set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should add and list user tokens and return 401 using invalid user id', async function () {
        context.response = await context.request.get(`/v1/user/${invalidId}/token`).set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should only list non-revoked user tokens and return 200', async function () {
        const validNameTwo = 'userMobileOne'

        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        const { body: tokenResultsBody } = await context.request
          .get(`/v1/user/${validUserId}/token`)
          .set('user-id', `${validUserId}`)

        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameTwo, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        await context.request
          .delete(`/v1/user/${validUserId}/token/${tokenResultsBody[0].id}`)
          .set('user-id', `${validUserId}`)

        context.response = await context.request.get(`/v1/user/${validUserId}/token`).set('user-id', `${validUserId}`)

        const expectedResult = [{ id: tokenResultsBody[0].id, name: validNameTwo, revoked: false }]

        expect(context.response.status).to.equal(200)

        expect(context.response.body.length).to.equal(expectedResult.length)
        expect(context.response.body[0].id).to.not.equal(expectedResult[0].id)
        expect(context.response.body[0].name).to.equal(expectedResult[0].name)
        expect(context.response.body[0].revoked).to.equal(expectedResult[0].revoked)
      })
    })

    describe('DELETE revoke user tokens', function () {
      it('should revoke user token and return 200 using valid user token', async function () {
        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        const { body: tokenResultsBody } = await context.request
          .get(`/v1/user/${validUserId}/token`)
          .set('user-id', `${validUserId}`)

        const expectedResult = { id: tokenResultsBody[0].id, name: tokenResultsBody[0].name, revoked: true }

        context.response = await context.request
          .delete(`/v1/user/${validUserId}/token/${tokenResultsBody[0].id}`)
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(200)

        expect(context.response.body.id).to.equal(expectedResult.id)
        expect(context.response.body.name).to.equal(expectedResult.name)
        expect(context.response.body.revoked).to.equal(expectedResult.revoked)
      })

      it('should revoke user token and return 401 using invalid user id header', async function () {
        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        const { body: tokenResultsBody } = await context.request
          .get(`/v1/user/${validUserId}/token`)
          .set('user-id', `${validUserId}`)

        context.response = await context.request
          .delete(`/v1/user/${validUserId}/token/${tokenResultsBody[0].id}`)
          .set('user-id', 0)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should revoke user token and return 401 using invalid user id header', async function () {
        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        const { body: tokenResultsBody } = await context.request
          .get(`/v1/user/${validUserId}/token`)
          .set('user-id', `${validUserId}`)

        context.response = await context.request
          .delete(`/v1/user/${validUserId}/token/${tokenResultsBody[0].id}`)
          .set('user-id', invalidId)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      // ACLs required to further extend this functionality so an admin can revoke any user token and/or disable a user
      it('should return 401 using invalid user id', async function () {
        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        const { body: tokenResultsBody } = await context.request
          .get(`/v1/user/${validUserId}/token`)
          .set('user-id', `${validUserId}`)

        context.response = await context.request
          .delete(`/v1/user/${invalidId}/token/${tokenResultsBody[0].id}`)
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should return 401 using invalid user id', async function () {
        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        const { body: tokenResultsBody } = await context.request
          .get(`/v1/user/${validUserId}/token`)
          .set('user-id', `${validUserId}`)

        context.response = await context.request
          .delete(`/v1/user/0/token/${tokenResultsBody[0].id}`)
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(401)
        expect(context.response.body).to.deep.equal({})
      })

      it('should return 404 using invalid token id', async function () {
        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        context.response = await context.request
          .delete(`/v1/user/${validUserId}/token/${invalidId}`)
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(404)
        expect(context.response.body).to.deep.equal({})
      })

      it('should return 400 using invalid token id', async function () {
        await context.request
          .post(`/v1/user/${validUserId}/token`)
          .send({ name: validNameOne, expiry: validExpiry })
          .set('user-id', `${validUserId}`)

        context.response = await context.request
          .delete(`/v1/user/${validUserId}/token/0`)
          .set('user-id', `${validUserId}`)

        expect(context.response.status).to.equal(400)
        expect(context.response.body).to.deep.equal({})
      })
    })
  })
})
