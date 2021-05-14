const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({message:'Token necessário'});
  }

  const [, token] = authorization.split(' ');

  const secret = process.env.SECRET;

  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      return res.status(401).json({message:'Usuario não autenticado'});
    }
    next();
  })
  
}

module.exports = auth;