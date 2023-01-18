export const up = async (knex) => {
  // check extension is not installed
  const [extInstalled] = await knex('pg_extension').select('*').where({ extname: 'uuid-ossp' })

  if (!extInstalled) {
    await knex.raw('CREATE EXTENSION "uuid-ossp"')
  }

  const uuidGenerateV4 = () => knex.raw('uuid_generate_v4()')
  const now = () => knex.fn.now()

  await knex.schema.createTable('user_tokens', (def) => {
    def.uuid('id').primary().defaultTo(uuidGenerateV4())
    def.uuid('user_id').notNullable()
    def.string('name', 50).notNullable()
    def.string('token_hash').notNullable()
    def.boolean('revoked').defaultTo(false).notNullable()
    def.datetime('last_used').nullable()
    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())

    def.index(['user_id', 'name'])
  })

  await knex.schema.createTable('thing_tokens', (def) => {
    def.uuid('id').primary().defaultTo(uuidGenerateV4())
    def.uuid('thing_id').notNullable()
    def.string('name', 50).notNullable()
    def.string('token_hash').notNullable()
    def.boolean('revoked').defaultTo(false).notNullable()
    def.datetime('last_used').nullable()
    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())

    def.index(['thing_id', 'name'])
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable('user_tokens')
  await knex.schema.dropTable('thing_tokens')
  await knex.raw('DROP EXTENSION "uuid-ossp"')
}
