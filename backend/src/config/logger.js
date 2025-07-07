const fs = require('fs')
const path = require('path')
const { createLogger, transports, format } = require('winston')

const logsDir = path.join(__dirname, '../logs')

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logsDir, 'erros.log'), level: 'error' }),
    new transports.File({ filename: path.join(logsDir, 'completo.log'), level: 'info' }),
  ],
})

module.exports = logger
