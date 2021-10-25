# Database usage

`wasp-authentication-service` is utilises a PostgreSQL database for storing authentication tokens to enable user access to the `WASP` platform.

## Database migrations

Database migrations are handled using [`knex.js`](https://knexjs.org/) and can be migrated manually using the following commands:

```sh
npx knex migrate:latest # used to migrate to latest database version
npx knex migrate:up # used to migrate to the next database version
npx knex migrate:down # used to migrate to the previous database version
```

## Table structure

The following tables exist in the `authentication` database.

### `user_tokens`

`user_tokens` represent the list of `tokens` for existing users of `WASP`.

#### Columns

| column       | PostgreSQL type           | nullable | default | description                                                 |
| :----------- | :------------------------ | :-------- | :------------------: | :-------------------------------------------- |
| `id`         | `UUID`                    |   FALSE   | `uuid_generate_v4()` | Unique identifier for the `token`             |
| `user_id`    | `UUID`                    |   FALSE   |          -           | Unique identifier of the user for the`token`  |
| `name`       | `CHARACTER VARYING(50)`   |   FALSE   |          -           | Name of the token                             |
| `token_hash` | `CHARACTER`               |   FALSE   |          -           | Hash of the token                             |
| `revoked`    | `BOOLEAN`                 |   FALSE   |        `false`       | Revoke flag of the token                      |
| `created_at` | `Timestamp with timezone` |   FALSE   |        `now()`       | When the row was first created                |
| `updated_at` | `Timestamp with timezone` |   FALSE   |        `now()`       | When the row was last updated                 |

#### Indexes

| columns           | Index Type | description                                                          |
| :-----------------| :--------- | :------------------------------------------------------------------- |
| `id`              | PRIMARY    | Primary key                                                          |
| `user_id, name`   | INDEX      | Allows quick filtering of `tokens` by `user_id` and `name`           |

### `thing_tokens`

`thing_tokens` represent the list of `tokens` for existing things of `WASP`.

#### Columns

| column       | PostgreSQL type           | nullable | default | description                                                 |
| :----------- | :------------------------ | :-------- | :------------------: | :-------------------------------------------- |
| `id`         | `UUID`                    |   FALSE   | `uuid_generate_v4()` | Unique identifier for the `token`             |
| `thing_id`   | `UUID`                    |   FALSE   |          -           | Unique identifier of the thing for the`token` |
| `name`       | `CHARACTER VARYING(50)`   |   FALSE   |          -           | Name of the token                             |
| `token_hash` | `CHARACTER`               |   FALSE   |          -           | Hash of the token                             |
| `revoked`    | `BOOLEAN`                 |   FALSE   |        `false`       | Revoke flag of the token                      |
| `created_at` | `Timestamp with timezone` |   FALSE   |        `now()`       | When the row was first created                |
| `updated_at` | `Timestamp with timezone` |   FALSE   |        `now()`       | When the row was last updated                 |

#### Indexes

| columns           | Index Type | description                                                          |
| :-----------------| :--------- | :------------------------------------------------------------------- |
| `id`              | PRIMARY    | Primary key                                                          |
| `thing_id, name`  | INDEX      | Allows quick filtering of `tokens` by `thing_id` and `name`          |
