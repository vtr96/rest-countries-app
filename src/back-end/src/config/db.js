const mongoose = require('mongoose');

const conectarAoBanco = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/BancoDeDados', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');
  } catch (erro) {
    console.error('Erro ao conectar no MongoDB:', erro.message);
    process.exit(1); // Encerra o servidor se der erro
  }
};

module.exports = conectarAoBanco;
