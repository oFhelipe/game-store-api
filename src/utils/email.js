const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nao.responda.game.store@gmail.com',
    pass: 'gamestore123'
  }
})


module.exports = transporter