const express = require('express');
const router = express.Router();

const code_controller = require('../controllers/code_controller');

router.post('/create', code_controller.createFile);
router.post('/save', code_controller.saveFile);

module.exports = router;