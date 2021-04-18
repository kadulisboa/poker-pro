const knex = require('knex');

async function up(knex) {
    return knex.schema.createTable('transfer', table => {
        table.increments('id').primary();
        table.integer('origin_id').notNullable().references('id').inTable('users');
        table.integer('destination_id').notNullable().references('id').inTable('users');
        table.decimal('value').notNullable();
        table.datetime('transfer_in').notNullable().defaultTo(knex.fn.now());
    })
}

async function down(knex) {
    return knex.schema.dropTable('transfer');
}

module.exports = {
    up,
    down
}
