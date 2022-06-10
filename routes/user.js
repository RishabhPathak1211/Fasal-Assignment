const express = require('express');
const userControllers = require('../controllers/user');

const router = express.Router();

router.route('/auth')
.get(userControllers.renderAuth)
.post(userControllers.handleAuth);

router.get('/logout', userControllers.logout);

module.exports = router;