const con = require('../database/connection')

module.exports = {
  async create (req, res) {
    const {
      name,
      background,
      character,
      cover,
      developer,
      destributor,
      drescription,
      price,
      platform,
      discount,
      gender,
      size,
      multiplayer,
      release,
      multimedia
    } = req.body;
  
    //discout 0 ele reconhece como false

    //platform e multimedia tem que fazer JSON.stringfy()

    //corrigir nome description no migration

    if (!name ||
        !background ||
        !character ||
        !cover ||
        !developer ||
        !destributor ||
        !drescription ||
        !price ||
        !platform ||
        !discount ||
        !gender ||
        !size ||
        !multiplayer ||
        !release ||
        !multimedia
    ) {
      return res.status(406).json({message:'Todas as informações são obrigatórias'})
    }

    try {
      const gameData = {
        name,
        background,
        character,
        cover,
        developer,
        destributor,
        drescription,
        price,
        platform,
        discount,
        gender,
        size,
        multiplayer,
        release,
        multimedia
      }
      const [ game ] = await con('game').insert({ ...gameData })
      
      return res.json(game);

    } catch (error) {
      return res.status(500).json({message:'Erro interno'})
    }

  }
}