const express = require('express');
const conectarAoBanco = require('./src/config/db'); // sua função de conexão
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');

const app = express();
conectarAoBanco();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
