const { expect } = require('chai')

const assertUserToken = (actualResult, expectedResult) => {
  expect(actualResult).to.have.property('id')
  expect(actualResult.name).to.equal(expectedResult.name)
  expect(actualResult.revoked).to.equal(expectedResult.revoked)
}

const assertUserTokens = (actualResult, expectedResult) => {
  expect(actualResult.length).to.equal(expectedResult.length)

  for (let counter = 0; counter < actualResult.length; counter++) {
    assertUserToken(actualResult[counter], expectedResult[counter])
  }
}

module.exports = {
  assertUserToken,
  assertUserTokens,
}
