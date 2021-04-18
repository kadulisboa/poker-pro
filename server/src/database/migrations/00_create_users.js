const knex = require('knex');

async function up(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('balance').notNullable().defaultTo(10.00);
    })
}

async function down(knex) {
    return knex.schema.dropTable('users');
}

module.exports = {
    up,
    down
}
