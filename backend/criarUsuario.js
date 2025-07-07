const User = require('./src/models/User')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const criarUsuario = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const usuario = new User({
      email: 'admin@admin',
      senha: await bcrypt.hash('admin123', 10),
    })

    await usuario.save()
    console.log('Usuário criado com sucesso!')
    await mongoose.disconnect()
  } catch (erro) {
    console.error('Erro ao criar usuário:', erro.message)
  }
}

module.exports = criarUsuario;
