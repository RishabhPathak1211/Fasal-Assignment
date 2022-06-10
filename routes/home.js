const express = require('express');
const homeControllers = require('../controllers/home');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', homeControllers.getLanging);
router.get('/home', auth, homeControllers.renderHome);
router.get('/search', auth, homeControllers.search);

module.exports = router;