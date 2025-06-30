console.log('🔥 Arquivo authRoutes.js carregado!');

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    const token = jwt.sign(
    { id: usuario._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

    res.json({ token });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro no servidor', erro });
  }
});

//Resgistro
router.post('/register', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const hashed = await bcrypt.hash(senha, 10);
    const novoUser = new User({ email, senha: hashed });
    await novoUser.save();
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar usuário', erro });
  }
});

//Busca de usuário individual

router.get('/users/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  // Verificar se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensagem: 'ID inválido' });
  }

  try {
    const user = await User.findById(id).select('-senha'); // não retorna senha
    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro });
  }
});

//Buscar todos os usuários
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-senha');
    res.json(users);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro });
  }
});

router.get('/teste', (req, res) => {
  res.send('rota funcionando');
});



module.exports = router;
