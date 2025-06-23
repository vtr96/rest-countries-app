const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../../../models/User');

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
      'secreta-super-segura', // Idealmente use uma variável de ambiente
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro no servidor', erro });
  }
});

module.exports = router;
