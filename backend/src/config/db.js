const mongoose = require('mongoose')

const conectarAoBanco = async () => {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI está vazio!')

    await mongoose.connect(uri)
    console.log('Conectado ao MongoDB')
  } catch (erro) {
    console.error('Erro ao conectar no MongoDB:', erro.message)
  }
}

module.exports = conectarAoBanco
