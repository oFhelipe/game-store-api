const bcrypt = require('bcrypt')
const con = require('../database/connection')
const jwt = require('jsonwebtoken')
const transporter = require('../utils/email')

module.exports = {
  async create (req, res) {
    const {
      name,
      username,
      email,
      password,
      confirmPassword,
      birthday
    } = req.body

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !birthday
    ) {
      return res
        .status(406)
        .json({ message: 'Todas as informações são obrigatórias' })
    }

    if (password !== confirmPassword) {
      return res.status(406).json({ message: 'Senhas não coincidem' })
    }

    try {
      const encryptedPassword = await bcrypt.hash(password, 8)

      const user = await con('user').insert({
        name,
        username,
        email,
        password: encryptedPassword,
        birthday
      })
      return res.json(user)
    } catch (error) {
      console.log(500)
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  },

  async emailToRecoverPassword (req, res) {
    try {
      const { email, url } = req.body

      if (!email) {
        return res.status(406).json({ message: 'Email obrigatório' })
      }

      const [user] = await con('user')
        .select('*')
        .where({ email })

      if (!user) {
        return res.status(406).json({ message: 'Não autorizado' })
      }

      const theUser = {
        name: user.name,
        email: user.email,
        username: user.username,
        changePassword: true
      }

      const secret = process.env.PASSWORD_SECRET

      const token = await jwt.sign(theUser, secret)

      const attachments = [
        {
          filename: 'logo.png',
          path: `${__dirname}/../assets/images/logo.png`,
          cid: 'logo'
        }
      ]

      const link = `${url}/recuperarsenha?changeToken=${token}`

      let emailText = `
        <body>
          <div style='background-color: #ffcc00; text-align: center;'>
            <div style='background-color:#fff; width:50%; padding:25px 0px; margin: 0 auto;'>
              <div style='width: 100%; text-align: center;'>
                <img style='height: 50%;' src='cid:logo' alt='logo Game store' />
                <p>Game-Store</p>
              </div>
            
              <p style='font-weight: 300; font-size: 1.2rem;'>Recuperação de senha</p>

              <p>Olá ${user.name}, para alterar a senha do usuário <strong>${user.username}</strong> clique no link abaixo</p>

              <a href="${link}">Clique aqui para recuperar sua senha</a>
            </div>
          </div>
        </body>
      `

      await transporter.sendMail({
        from: 'GameStore <nao.responsa.game.store@gmail.com>',
        to: user.email,
        subject: 'Recuperação de senha',
        html: emailText,
        attachments
      })

      return res.json({ message: 'Email de recuperação enviado com sucesso' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  },

  async changePassword (req, res) {
    try {
      const { token, password, confirmPassword } = req.body

      if (!token || !password || !confirmPassword) {
        return res
          .status(406)
          .json({ message: 'Todas as informações são obrigatórias' })
      }

      if (password !== confirmPassword) {
        return res.status(406).json({ message: 'Senhas não coincidem' })
      }
      const secret = process.env.PASSWORD_SECRET

      jwt.verify(token, secret, async (error, decoded) => {
        if (error) {
          console.log(error)
          return res.status(401).json({ message: 'Autenticação inválida' })
        }

        const encryptedPassword = await bcrypt.hash(password, 8)

        await con('user')
          .update({ password: encryptedPassword })
          .where({ username: decoded.username, name: decoded.name })

        return res.json({ message: 'Senha alterada com sucesso' })
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}
