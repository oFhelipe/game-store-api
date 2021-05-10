const express = require('express');
const cors = require('cors')

const app = express();
const port = process.env.PORT | 3333;

const routes = require('./Routes')

app.use(cors());
app.use(express.json());
app.use(routes);


app.listen(port,() => {
  console.log(`Servidor iniciado na porta ${port}`)
});