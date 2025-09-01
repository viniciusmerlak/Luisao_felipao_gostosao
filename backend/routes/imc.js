const express = require('express');
const router = express.Router();
const imcController = require('../controllers/imcController');

router.post('/calcular', imcController.calcularIMC);

module.exports = router;