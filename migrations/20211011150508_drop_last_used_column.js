export const up = async function (knex) {
  await knex.schema.table('user_tokens', (def) => {
    def.dropColumn('last_used')
  })

  await knex.schema.table('thing_tokens', (def) => {
    def.dropColumn('last_used')
  })
}

export const down = async function (knex) {
  await knex.schema.table('user_tokens', (def) => {
    def.datetime('last_used').nullable()
  })

  await knex.schema.table('thing_tokens', (def) => {
    def.datetime('last_used').nullable()
  })
}
