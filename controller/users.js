const { connect } = require('../connect');
const users = require('../routes/users');

module.exports = {
  getUsers: async (req, resp, next) => {
    // TODO: Implementa la función necesaria para traer la colección `users`
    try {
      const { db, client } = await client.connect();

      const usersDb = db.collection('Users');
      const users = await usersDb.find({});

      resp.send(users);
      await client.close();
    } catch (error) {
      next(error);
    }
  }
};
