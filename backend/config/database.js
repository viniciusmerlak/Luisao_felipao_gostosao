const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Vinaogostoso27@1@2008',
  database: process.env.DB_NAME || 'superfood'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('✅ Conectado ao MySQL');
});

module.exports = connection;    