'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Todo extends Model {
	user() {
		return this.belongsTo('App/Models/User')
	}

	files() {
		return this.hasMany('App/Models/File')
	}
}

module.exports = Todo
