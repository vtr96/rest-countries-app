const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const rateLimit = require('express-rate-limit');
require('dotenv').config()

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: 'Muitas tentativas. Tente novamente mais tarde.',
});


//Login
router.post('/users/login', loginLimiter, async (req, res) => {
  const { email, senha } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ mensagem: 'Email é obrigatório e deve ser uma string.' });
  }
  if (!senha || typeof senha !== 'string' || senha.length < 6) {
    return res.status(400).json({ mensagem: 'Senha é obrigatória e deve ter pelo menos 6 caracteres.' });
  }

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
    console.error('Erro ao fazer login:', erro.message);
    res.status(500).json({ mensagem: 'Erro no servidor ao fazer login', erro: erro.message });
  }
});

// Registro
router.post('/users/register', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ mensagem: 'Email é obrigatório e deve ser uma string.' });
  }
  if (!senha || typeof senha !== 'string' || senha.length < 6) {
    return res.status(400).json({ mensagem: 'Senha é obrigatória e deve ter pelo menos 6 caracteres.' });
  }

  try {
    const hashed = await bcrypt.hash(senha, 10);
    const novoUser = new User({ email, senha: hashed });
    await novoUser.save();
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  } catch (erro) {
    console.error('Erro ao criar usuário:', erro);
    if (erro.code === 11000) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }
    res.status(500).json({
      mensagem: 'Erro ao criar usuário',
      erro: erro.message || erro.toString()
    });
  }
});

//Buscar usuário individual por ID
router.get('/users/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensagem: 'ID inválido' });
  }

  try {
    const user = await User.findById(id).select('-senha');
    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (erro) {
    console.error('Erro ao buscar usuário por ID:', erro.message);
    res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro: erro.message });
  }
});

//Buscar todos os usuários
router.get('/users/list', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-senha');
    res.json(users);
  } catch (erro) {
    console.error('Erro ao buscar todos os usuários:', erro.message);
    res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: erro.message });
  }
});

module.exports = router;

