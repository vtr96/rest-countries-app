const express = require('express');
const conectarAoBanco = require('./src/config/db');
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');

const app = express();
conectarAoBanco();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});