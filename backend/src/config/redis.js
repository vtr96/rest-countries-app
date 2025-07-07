const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: 'localhost',
    port: 6379
  }
});

client.on('error', (err) => {
  console.error('Erro ao conectar no Redis:', err);
});

client.on('connect', () => {
  console.log('Conectado ao Redis');
});

client.connect();

module.exports = client;
