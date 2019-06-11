const express = require('express');
const route   = express.Router();

/**
 * Controllers
 */

const parseController = require('../controllers/parse.controller');
const ParseController = new parseController();

route.get('/home', (req, res) => {
    ParseController.generationCharacters(req, res);
});

module.exports = route; 