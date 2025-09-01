const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');

router.get('/', recipesController.getRecipes);

module.exports = router;