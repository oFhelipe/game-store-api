const con = require('../database/connection')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  async create (req, res) {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(406).json({ message: 'Todas as informações são obrigatórias' });
    }

    try {
      
      const [ user ] = await con('user').select('*').where({ username }).limit(1);

      if (!user) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      const encryptedUser = {
        name: user.name,
        email: user.email,
        username: user.username,
        birthday: user.birthday
      }

      //criar token de autenticação
      const token = await jwt.sign(encryptedUser, 'secret');

      return res.json({ user:encryptedUser, token });

    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

  }
}