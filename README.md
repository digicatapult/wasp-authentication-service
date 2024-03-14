# wasp-authentication-service

## Deprecation Notice
`WASP` was deprecated on March 14th 2024, there will be no further dependency or security updates to this platform.
---

Authentication service for `WASP`. Handles the storage, retrieval and validation of tokens.

## Getting started

`wasp-authentication-service` can be run in a similar way to most nodejs application. First install required dependencies using `npm`:

```sh
npm install
```

`wasp-authentication-service` depends on a `postgresql` database dependency which can be brought up locally using docker:

```sh
docker-compose up -d
```

Finally the database must be initialised with:

```sh
npx knex migrate:latest
```

And finally you can run the application in development mode with:

```sh
npm run dev
```

Or run tests with:

```sh
npm test
```

## Environment Variables

`wasp-authentication-service` is configured primarily using environment variables as follows:

| variable                           | required |         default         | description                                                                          |
| :--------------------------------- | :------: | :---------------------: | :----------------------------------------------------------------------------------- |
| LOG_LEVEL                          |    N     |         `info`          | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`] |
| PORT                               |    N     |          `80`           | Port on which the service will listen                                                |
| API_VERSION                        |    N     |  `package.json version` | Official API version                                                                 |
| JWT_SECRET                         |    Y     |            -            | Secret for validating JSON web-tokens                                                |
| DB_HOST                            |    Y     |            -            | Hostname for the db                                                                  |
| DB_PORT                            |    N     |          5432           | Port to connect to the db                                                            |
| DB_NAME                            |    N     |     `authentication`    | Name of the database to connect to                                                   |
| DB_USERNAME                        |    Y     |            -            | Username to connect to the database with                                             |
| DB_PASSWORD                        |    Y     |            -            | Password to connect to the database with                                             |

## Database structure

The structure of the database backing `wasp-authentication-service` can be found in [docs/db.md](./docs/db.md)
