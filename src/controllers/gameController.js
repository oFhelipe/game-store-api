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
        gender: gender.toLowerCase(),
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
      const { platform, promotion, gender, order, game, page } = req.query
      const gamesQuery = con('game').select('*')
      const countQuery = con('game').count('id as count')

      if(page){
        const limit = 6;
        const offset = (page - 1) * limit;

        gamesQuery.offset(offset);
        gamesQuery.limit(limit)

      }

      if(game) {
        gamesQuery.andWhere('name', 'like', `%${game}%`)
        countQuery.andWhere('name', 'like', `%${game}%`)
      }

      if(platform && platform !== 'todas') {
        gamesQuery.andWhere('platform', 'like', `%${platform}%`)
        countQuery.andWhere('platform', 'like', `%${platform}%`)
      }

      if(gender && gender !== 'sem') {
        gamesQuery.andWhere({gender:gender.toLowerCase()})
        countQuery.andWhere({gender:gender.toLowerCase()})
      }


      if(promotion && promotion !== 'sem'){
        gamesQuery.andWhere('discount', '>', '0')
        countQuery.andWhere('discount', '>', '0')
        if(promotion !== 'todas'){
          gamesQuery.andWhere('discount', '<=', promotion/100)
          countQuery.andWhere('discount', '<=', promotion/100)
        }
      }

      if(order && order !== 'sem') {
          switch (order) {
            case 'novo':
              gamesQuery.orderBy('release', 'asc')
              break;
            case 'antigo':
              gamesQuery.orderBy('release', 'desc')
              break;
            case 'crescente':
              gamesQuery.orderBy('price', 'asc')
              break;
            case 'decrescente':
              gamesQuery.orderBy('price', 'desc')
              break;
          
            default:
              break;
          }
      }

      gamesQuery.then((games)=>{
        return countQuery.then(([{count}])=>{
          return res.json({games, count})
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:'Erro interno'})
    }
  },

  async getLancamentos(req, res) {
    try {
      const lancamentos = await con('game').select('*').limit(5);
      return res.json(lancamentos); 
    } catch (error) {
      console.log(error);
      return res.status(500).json({message:"Error interno"})
    }
  },

  async index(req, res) {
    try {
      const { gameId } = req.params;
      const [ game ] = await con('game').select('*').where({ id: gameId }).limit(1);
      if(!game) {
        return res.status(500).json({message:"Error interno"});
      }
      return res.json(game);
      
    } catch (error) {
      return res.status(500).json({message:"Error interno"});
    }
  }
}