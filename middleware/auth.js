const jwt = require('jsonwebtoken');
const { connect } = require('../connect');
const { ObjectId } = require('mongodb');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    console.log('token', decodedToken)
    const { client, db } = await connect();
    try {
      const usersCollection = db.collection('Users');
      const user = await usersCollection.findOne({ _id: new ObjectId(decodedToken.id) }, { projection: { password: 0 } });
      console.log('user', user);

      if (!user) {
        return resp.status(404).send({ message: "No user was found" });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    } finally {
      client.close();
    }
  });
};

module.exports.isAuthenticated = (req) => {
  const isAuthenticated = !!req.user;
  console.log('isAuthenticated:', isAuthenticated);
  return isAuthenticated;
};

module.exports.isAdmin = (req) => {
  const isAdmin = req.user && req.user.roles && req.user.roles.admin === true;
  console.log('isAdmin:', isAdmin);
  return isAdmin;
};

module.exports.requireAuth = (req, resp, next) => (
  !module.exports.isAuthenticated(req) ? resp.status(401).send({ error: 'Unauthorized' }) : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  !module.exports.isAuthenticated(req) ? resp.status(401).send('Unauthorized') :
    !module.exports.isAdmin(req) ? resp.status(403).send('Forbidden') : next()
);

