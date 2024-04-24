const jwt = require('jsonwebtoken');
const key = require('../config/key');

function checkUserRole(role) {
  return function(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, key.security, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized');
      } else {
        if (decoded.role >= role) {
          next();
        } else {
          res.status(403).send('Forbidden');
        }
      }
    });
  };
}

module.exports =  { checkUserRole };