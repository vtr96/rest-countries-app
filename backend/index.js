const express = require('express')
const conectarAoBanco = require('./src/config/db') 
require('dotenv').config()

const authRoutes = require('./src/routes/authRoutes')
const cors = require('cors')
const mongoSanitize = require('mongo-sanitize')
const cookieParser = require('cookie-parser')

const app = express()
conectarAoBanco()

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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
