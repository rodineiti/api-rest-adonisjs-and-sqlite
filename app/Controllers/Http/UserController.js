"use strict";

const User = use("App/Models/User");
const { validate } = use("Validator");

class UserController {
  async store({ request, response }) {
    try {
      const rules = {
        username: "required|min:5|unique:users",
        email: "required|email|unique:users",
        password: "required|min:6"
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(401).send({ message: validation.messages() });
      }

      const data = request.only(["username", "email", "password"]);

      const user = await User.create(data);

      return user;
    } catch (err) {
      return response.status(500).send({ error: `Error: ${err.message}` });
    }
  }

  async login({ request, response, auth }) {
    try {
      const { email, password } = request.all();

      const token = await auth.attempt(email, password);

      return token;
    } catch (err) {
      return response.status(500).send({ error: `Error: ${err.message}` });
    }
  }
}

module.exports = UserController;
