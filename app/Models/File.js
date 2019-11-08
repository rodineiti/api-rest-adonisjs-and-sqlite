'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class File extends Model {
	todo() {
		return this.belongsTo('App/Models/Todo')
	}
}

module.exports = File
