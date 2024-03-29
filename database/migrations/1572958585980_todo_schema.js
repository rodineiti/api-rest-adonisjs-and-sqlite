"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TodoSchema extends Schema {
  up() {
    this.create("todos", table => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users')
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("title").notNullable();
      table.string("description").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("todos");
  }
}

module.exports = TodoSchema;
