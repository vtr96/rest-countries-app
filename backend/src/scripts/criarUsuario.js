const User = require('../models/User')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const criarUsuario = async () => {
  try {
    console.log('DB URI:', process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI)
    console.log('DB URI:', process.env.MONGO_URI)

    const usuario = new User({
      email: 'admin',
      senha: await bcrypt.hash('admin', 10),
    })

    await usuario.save()
    console.log('Usuário criado com sucesso!')
    mongoose.disconnect()
  } catch (erro) {
    console.error('Erro ao criar usuário:', erro.message)
  }
}

criarUsuario()
