const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    movieIds: {
        type: [String],
        default: []
    },
    private: {
        type: Boolean,
        default: false
    },
    name: String
});

module.exports = mongoose.model('Playlist', playlistSchema);