const express = require('express');
const playlistControllers = require('../controllers/playlist');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/')
.post(auth, playlistControllers.createPlaylist)
.get(auth, playlistControllers.renderCreatePlaylist)
.put(auth, playlistControllers.addToPlaylist)
.delete(auth, playlistControllers.removeFromPlaylist);

router.route('/:playlistId')
.get(auth, playlistControllers.viewPlaylist);

module.exports = router;