const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const criarUsuario = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/seubanco')

    const senhaCriptografada = await bcrypt.hash('123456', 10);

    const novoUsuario = new User({
      email: 'felipe@email.com',
      senha: senhaCriptografada,
    });

    await novoUsuario.save();
    console.log('Usuário criado com sucesso!');
    mongoose.disconnect();
  } catch (erro) {
    console.error('Erro ao criar usuário:', erro.message);
  }
};

criarUsuario();
