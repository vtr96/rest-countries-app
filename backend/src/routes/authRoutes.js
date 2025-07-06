const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const redisClient = require('../utils/redis');
require('dotenv').config();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Muitas tentativas. Tente novamente mais tarde.',
});

//Login
router.post('/users/login', loginLimiter, async (req, res) => {
  const { email, senha } = req.body;

  if (!email || typeof email !== 'string') {
    logger.warn('Email inválido na tentativa de login');
    return res.status(400).json({ mensagem: 'Email é obrigatório e deve ser uma string.' });
  }

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      logger.warn(`Falha no login, usuário não encontrado`);
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      logger.warn(`Falha no login, senha inválida`);
      return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`Login bem-sucedido para: ${email}`);
    res
      .cookie('token', token, {
        httpOnly: false,
        secure: true, // Use true se estiver usando HTTPS em produção
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000, // 1 hora
      })
      .json({ token });

  } catch (erro) {
    logger.error(`Erro ao fazer login: ${erro.message}`);
    res.status(500).json({ mensagem: 'Erro no servidor ao fazer login', erro: erro.message });
  }
});

//Registro
router.post('/users/register', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || typeof email !== 'string') {
    logger.warn(`Falha na tentativa de registro, email não foi reconhecido`);
    return res.status(400).json({ mensagem: 'Email é obrigatório e deve ser uma string.' });
  }

  if (!senha || typeof senha !== 'string' || senha.length < 6) {
    logger.warn(`Falha na tentativa de registro, senha muito pequena`);
    return res.status(400).json({ mensagem: 'Senha é obrigatória e deve ter pelo menos 6 caracteres.' });
  }

  try {
    const hashed = await bcrypt.hash(senha, 10);
    const novoUser = new User({ email, senha: hashed });
    await novoUser.save();

    await redisClient.del('usersList'); // Limpa o cache após novo registro

    logger.info(`Usuário registrado com sucesso: ${email}`);
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });

  } catch (erro) {
    if (erro.code === 11000) {
      logger.error(`Erro ao cadastrar usuário, email já existente`);
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }
    logger.error(`Erro ao criar usuário: ${erro.message}`);
    res.status(500).json({
      mensagem: 'Erro ao criar usuário',
      erro: erro.message || erro.toString()
    });
  }
});

//Buscar Usuários por ID
router.get('/users/list/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`Falha ao buscar usuário, Id inválido`);
    return res.status(400).json({ mensagem: 'ID inválido' });
  }

  try {
    const cacheKey = `user_${id}`;
    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      logger.info(`Busca por ID: usuário recuperado do cache`);
      return res.json(JSON.parse(cachedUser));
    }

    const user = await User.findById(id).select('-senha');
    if (!user) {
      logger.warn(`Usuário não encontrado: ${id}`);
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    await redisClient.setEx(cacheKey, 600, JSON.stringify(user)); // 10 minutos de cache
    logger.info(`Usuário encontrado`);
    res.json(user);

  } catch (erro) {
    logger.error(`Erro ao buscar usuário por ID: ${erro.message}`);
    res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro: erro.message });
  }
});

//Buscar todos os usuários
router.get('/users/list', authMiddleware, async (req, res) => {
  try {
    const cachedUsers = await redisClient.get('usersList');
    if (cachedUsers) {
      logger.info(`Busca de usuários realizada via cache`);
      return res.json(JSON.parse(cachedUsers));
    }

    const users = await User.find().select('-senha');
    await redisClient.setEx('usersList', 300, JSON.stringify(users)); // 5 minutos de cache

    logger.info(`Busca de usuários realizada no MongoDB`);
    res.json(users);

  } catch (erro) {
    logger.error(`Erro ao buscar usuários: ${erro.message}`);
    res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: erro.message });
  }
});

//Validação de token
router.get('/validate', authMiddleware, (req, res) => {
  logger.info(`Token validado com sucesso para usuário ID: ${req.user.id}`);
  res.status(200).json({ authenticated: true });
});

module.exports = router;
