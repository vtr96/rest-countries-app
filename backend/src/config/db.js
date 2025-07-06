const mongoose = require('mongoose')

const conectarAoBanco = async () => {
  try {
    const uri = process.env.MONGO_URI

    await mongoose.connect(uri, {
      maxPoolSize: 10,              
      minPoolSize: 2,               
      serverSelectionTimeoutMS: 5000, 
    })

  } catch (erro) {
    console.error('Erro ao conectar no MongoDB:', erro.message)
  }
}

module.exports = conectarAoBanco
