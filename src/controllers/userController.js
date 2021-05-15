const bcrypt = require('bcrypt');
const con = require('../database/connection');

module.exports = {

  async create(req,res){
    const { name, username, email, password, confirmPassword, birthday } = req.body;
    
    if (!name || !username || !email || !password || !confirmPassword || !birthday) {
      return res.status(406).json({ message: 'Todas as informações são obrigatórias' });
    }
  
    if (password !== confirmPassword) {
      return res.status(406).json({ message: 'Senhas não coincidem' });
    }
  
    try {
  
      const encryptedPassword = await bcrypt.hash(password, 8);
      
      const user = await con('user').insert({ name, username, email, password:encryptedPassword, birthday });
      return res.json(user);
  
    } catch (error) {
      console.log(500)
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

}