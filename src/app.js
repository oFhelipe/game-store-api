const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT | 3333;

const routes = require('./routes/index.js')

app.use(cors());
app.use(express.json());
app.use(routes);


app.listen(port,() => {
  console.log(`Servidor iniciado na porta ${port}`)
});