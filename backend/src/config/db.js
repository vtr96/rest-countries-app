const mongoose = require('mongoose');
require('dotenv').config();

const conectarAoBanco = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');
  } catch (erro) {
    console.error('Erro ao conectar no MongoDB:', erro.message);
    process.exit(1);
  }
};

module.exports = conectarAoBanco;
