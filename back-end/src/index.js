const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');


const app = express();

mongoose.connect('mongodb://localhost:27017/seubanco', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar no MongoDB', err));

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
