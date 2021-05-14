const con = require('../database/connection');

module.exports = {
  async create (req, res) {
    const {
      name,
      background,
      character,
      cover,
      developer,
      destributor,
      description,
      price,
      platform,
      discount,
      gender,
      size,
      multiplayer,
      release,
      multimedia
    } = req.body;
  

    if (!name ||
        !background ||
        !character ||
        !cover ||
        !developer ||
        !destributor ||
        !description ||
        !price ||
        !platform ||
        !gender ||
        !size ||
        !multiplayer ||
        !release ||
        !multimedia ||
        discount < 0 ||
        discount > 1 ||
        isNaN(discount)
    ) {
      return res.status(406).json({message:'Todas as informações são obrigatórias'})
    }

    if(!Array.isArray(platform) || ! Array.isArray(multimedia)) {
      return res.status(406).json({message:'Platform ou multimedia devem ser um array'})
    }
    
    try {
      const thePlataform = JSON.stringify(platform)
      const theMultimedia = JSON.stringify(multimedia)

      const gameData = {
        name,
        background,
        character,
        cover,
        developer,
        destributor,
        description,
        price,
        platform: thePlataform,
        discount,
        gender,
        size,
        multiplayer,
        release,
        multimedia: theMultimedia
      }
      const [ game ] = await con('game').insert({ ...gameData })
      
      return res.json(game);

    } catch (error) {
      console.log(error)
      return res.status(500).json({message:'Erro interno'})
    }

  },
  async getGames(req, res) {
    try {
      const { platform, promotion, gender, order } = req.query
      const gamesQuery = con('game').select('*')

      if(platform) {
        gamesQuery.where({platform})
      }

      if(gender) {
        gamesQuery.where({gender})
      }

      if(promotion){
        gamesQuery.where('discount', '<=', promotion)
      }

      gamesQuery.then((games)=>{
        return res.json(games)
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:'Erro interno'})
    }
  }
}