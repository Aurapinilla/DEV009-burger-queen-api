const jwt = require('jsonwebtoken');
const config = require('../config');
const { connect } = require('../connect');
const bcrypt = require('bcryptjs');
const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return resp.status(400).send({ error: 'Email and password are required.' });
      } else {
        const { client, db } = await connect();
        const usersCollection = db.collection('Users');
        const userExists = await usersCollection.findOne({ email: email });

        if (!userExists) {
          return resp.status(404).send({ error: 'User not found.' });
        }

        // Solo después de verificar que el usuario existe, se compara la contraseña
        const passwordMatches = bcrypt.compareSync(password, userExists.password);

        if (passwordMatches) {
          try {
            const token = jwt.sign({
              id: userExists.id,
              role: userExists.role,
            }, secret, { expiresIn: '1h' });

            return resp.status(200).send({ accessToken: token });
          } catch (tokenError) {
            if (tokenError.name === 'TokenExpiredError') {
              return resp.status(401).send({ error: 'Token expired.' });
            } else {
              return resp.status(401).send({ error: 'Invalid token.' });
            }
          }
        } else {
          return resp.status(404).send({ error: 'Invalid password.' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      return resp.status(401).send({ error: error.message });
    }

    next();
  });


  return nextMain();
};
