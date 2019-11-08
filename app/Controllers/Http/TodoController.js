'use strict'

const Database = use('Database')
const Todo = use('App/Models/Todo')
const { validate } = use("Validator");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with todos
 */
class TodoController {
  /**
   * Show a list of all todos.
   * GET todos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param {Auth} ctx.auth
   */
  async index ({ request, response, view, auth }) {
    const todos = await Todo.query().where('user_id', auth.user.id).withCount('files as total_files').fetch()
    // const todos = Database.select('id', 'title', 'description').from('todos').where('user_id', auth.user.id)
    return todos
  }

  /**
   * Create/save a new todo.
   * POST todos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store ({ request, response, auth }) {

    const rules = {
      title: "required",
      description: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(401).send({ message: validation.messages() });
    }

    const { id } = auth.user

    const data = request.only(['title','description'])

    const todo = await Todo.create({...data, user_id: id})

    return todo
  }

  /**
   * Display a single todo.
   * GET todos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param {Auth} ctx.auth
   */
  async show ({ params, request, response, view, auth }) {
    const todo = await Todo.query().where('id', params.id).where('user_id', auth.user.id).first()

    if (!todo) {
      return response.status(404).send({message:'Not found'})
    }

    await todo.load('files')

    return todo
  }

  /**
   * Update todo details.
   * PUT or PATCH todos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async update ({ params, request, response, auth }) {

    const rules = {
      title: "required",
      description: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(401).send({ message: validation.messages() });
    }

    const todo = await Todo.query().where('id', params.id).where('user_id', auth.user.id).first()

    if (!todo) {
      return response.status(404).send({message:'Not found'})
    }

    const {title, description} = request.all()

    todo.title = title
    todo.description = description
    todo.id = params.id

    await todo.save()

    return todo
  }

  /**
   * Delete a todo with id.
   * DELETE todos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async destroy ({ params, request, response, auth }) {
    const todo = await Todo.query().where('id', params.id).where('user_id', auth.user.id).first()

    if (!todo) {
      return response.status(404).send({message:'Not found'})
    }

    await todo.delete()

    return response.status(200).send({message:'Deleted'})
  }
}

module.exports = TodoController
