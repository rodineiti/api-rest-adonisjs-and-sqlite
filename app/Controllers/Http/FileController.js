'use strict'

const File = use('App/Models/File')
const Todo = use('App/Models/Todo')
const Helpers = use('Helpers')

class FileController {
	async store({ params, request, response }) {
		try {
			const todo = await Todo.findOrFail(params.id)

			const files = request.file('file', {
			  types: ['image'],
			  size: '2mb'
			})

			await files.moveAll(Helpers.tmpPath('uploads'))

			if (!files.movedAll()) {
			  return files.errors()
			}

			await Promise.all(
				files.movedList().map(item => todo.files().create({path:item.fileName}))
			)

			return response.status(200).send({message: 'Success'})
		} catch(err) {
			return response.status(404).send({message: 'Upload fail' + err})
		}	
	}
}

module.exports = FileController
