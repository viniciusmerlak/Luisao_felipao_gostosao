const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const imcRoutes = require('./routes/imc');
const recipesRoutes = require('./routes/recipes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/imc', imcRoutes);
app.use('/api/recipes', recipesRoutes);

// Servir arquivos estáticos do frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/receitas', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/receitas.html'));
});

app.get('/historico', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/historico.html'));
});

// Rota padrão para qualquer outra rota
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📁 Frontend servido de: ${path.join(__dirname, '../frontend')}`);
});