const express = require('express')
require('dotenv').config()

const authRoutes = require('./src/routes/authRoutes')
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const cors = require('cors')
const mongoSanitize = require('mongo-sanitize')
const cookieParser = require('cookie-parser')

const conectarAoBanco = require('./src/config/db')
const criarUsuario = require('./criarUsuario')

const app = express()

conectarAoBanco()
criarUsuario() //email: admin@admin | pw: admin123

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
});


app.use('/auth', authRoutes)
app.use('/api', favoriteRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
