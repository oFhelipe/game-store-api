const con = require('../database/connection')
const transporter = require('../utils/email')

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
    } = req.body

    if (
      !name ||
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
      return res
        .status(406)
        .json({ message: 'Todas as informações são obrigatórias' })
    }

    if (!Array.isArray(platform) || !Array.isArray(multimedia)) {
      return res
        .status(406)
        .json({ message: 'Platform ou multimedia devem ser um array' })
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
      const [game] = await con('game').insert({ ...gameData })

      return res.json(game)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erro interno' })
    }
  },
  async getGames (req, res) {
    try {
      const { platform, promotion, gender, order, game, page } = req.query
      const gamesQuery = con('game').select('*')
      const countQuery = con('game').count('id as count')

      if (page) {
        const limit = 6
        const offset = (page - 1) * limit

        gamesQuery.offset(offset)
        gamesQuery.limit(limit)
      }

      if (game) {
        gamesQuery.andWhere('name', 'like', `%${game}%`)
        countQuery.andWhere('name', 'like', `%${game}%`)
      }

      if (platform && platform !== 'todas') {
        gamesQuery.andWhere('platform', 'like', `%${platform}%`)
        countQuery.andWhere('platform', 'like', `%${platform}%`)
      }

      if (gender && gender !== 'sem') {
        gamesQuery.andWhere({ gender: gender.toLowerCase() })
        countQuery.andWhere({ gender: gender.toLowerCase() })
      }

      if (promotion && promotion !== 'sem') {
        gamesQuery.andWhere('discount', '>', '0')
        countQuery.andWhere('discount', '>', '0')
        if (promotion !== 'todas') {
          gamesQuery.andWhere('discount', '<=', promotion / 100)
          countQuery.andWhere('discount', '<=', promotion / 100)
        }
      }

      if (order && order !== 'sem') {
        switch (order) {
          case 'novo':
            gamesQuery.orderBy('release', 'asc')
            break
          case 'antigo':
            gamesQuery.orderBy('release', 'desc')
            break
          case 'crescente':
            gamesQuery.orderBy('price', 'asc')
            break
          case 'decrescente':
            gamesQuery.orderBy('price', 'desc')
            break

          default:
            break
        }
      }

      gamesQuery.then(games => {
        return countQuery.then(([{ count }]) => {
          return res.json({ games, count })
        })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erro interno' })
    }
  },

  async getLancamentos (req, res) {
    try {
      const lancamentos = await con('game')
        .select('*')
        .limit(5)
      return res.json(lancamentos)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error interno' })
    }
  },

  async index (req, res) {
    try {
      const { gameId } = req.params
      const [game] = await con('game')
        .select('*')
        .where({ id: gameId })
        .limit(1)

      if (!game) {
        return res.status(500).json({ message: 'Error interno' })
      }

      const theGame = {
        ...game,
        multimedia: JSON.parse(game.multimedia),
        platform: JSON.parse(game.platform)
      }

      return res.json(theGame)
    } catch (error) {
      return res.status(500).json({ message: 'Error interno' })
    }
  },

  async confirmOrder (req, res) {
    try {
      const { games, total, user, metodoPagamento } = req.body

      if (!games || !total || !user || !metodoPagamento) {
        return res
          .status(406)
          .json({ message: 'Todas as informações são obrigatórias' })
      }

      Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date.toISOString();
      }
      let data  = new Date();
      let dataIso   = String(data.addDays(5)).padStart(2,'0');
      
      let dataPagamento = dataIso.split("T")[0];

      const theDataPagamento = dataPagamento.split("-").reverse().join("/");

      let gameList = '';

      for (const game of games) {
        gameList += `<tr><td style="font-size:1rem; border-top: 1px solid #dee2e6; padding: .75rem; vertical-align: top;">${ game.name }</td> <td style="font-size:1rem; border-top: 1px solid #dee2e6; padding: .75rem; vertical-align: top;">${ parseFloat(game.price - (game.price * game.discount)).toFixed(2)  }</td></tr>`
      }

      const attachments = [
        {
          filename: 'logo.png',
          path: `${__dirname}/../assets/images/logo.png`,
          cid: 'logo'
        },
        {
          filename: 'gameCodigo.png',
          path: `${__dirname}/../assets/images/gameCodigo.png`,
          cid: 'gameCodigo'
        }
      ]

      let emailText = `
        <body>
          <div style='background-color: #ffcc00; text-align: center;'>
            <div style='background-color:#fff; width:50%; padding:25px 0px; margin: 0 auto;'>
              <div style='width: 100%; text-align: center;'>
                <img style='height: 50%;' src='cid:logo' alt='logo Game store' />
                <p>Game-Store</p>
              </div>
            
              <p style='font-weight: 300; font-size: 1.2rem;'>Lista de produtos comprados</p>

              <table style='text-align: left; border-collapse: collapse; width: fit-content; margin:0 auto;'>
                <thead>
                  <tr>
                    <th style='background-color: #212529; color: #fff; padding: .60rem;'>Game</th>
                    <th style='background-color: #212529; color: #fff; padding: .60rem;'>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  ${gameList}
                </tbody>
              </table>

              <p style='font-weight: bold; font-size: 1rem;' class='total'>Valor total da compra: R$ ${total.toFixed(2)}</p>
              <p style='font-weight: bold; font-size: 1rem;'>Data de Vencimento: ${theDataPagamento}</p>
              <p style='width: fit-content; padding: 5px; color: #fff; background-color: #000; font-weight: bold; margin:0 auto;'>Pedido N°: ${ Math.floor(Math.random() * 100000) }</p>

              ${
                metodoPagamento === "boleto" && "<img style='width: 90%; object-fit: cover; margin-top: 8px; height: 40px;' src='cid:gameCodigo' alt='codigo de compra' />"
              }
              <p style="font-size: .70rem">Email de modelo -- Este email é falso, favor ignora-lo </p>
            </div>
          </div>
        </body>
      `

      await transporter.sendMail({
        from: 'GameStore <nao.responsa.game.store@gmail.com>',
        to: user.email,
        subject: 'Lista de produtos comprados',
        html: emailText,
        attachments
      })

      return res.json({message: 'Compra realizada com sucesso!!'})
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error interno' })
    }
  }
}
