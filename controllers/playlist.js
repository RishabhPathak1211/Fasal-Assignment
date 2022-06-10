const axios = require('axios');
const playlistModel = require('../models/playlist');
const ExpressError = require('../utils/ExpressError');

module.exports.createPlaylist = async (req, res, next) => {
    const { token } = req.query;
    const { name, private } = req.body;
    const { user } = req;
    if (!name) return next(new ExpressError('Enter Playlist Name', 400));
    try {
        const check = await playlistModel.findOne({ name });
        if (check) return next(new ExpressError('Playlist name must be unique', 401));
        const playlist = new playlistModel({ userId: user.id, name, private: private ? true : false });
        await playlist.save();
        return res.redirect(`/home?token=${token}`)
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.renderCreatePlaylist = (req, res, next) => {
    const { token } = req.query;
    res.render('playlistForm', { token });
}

module.exports.viewPlaylist = async (req, res, next) => {
    const { user } = req;
    const { token } = req.query;
    const { playlistId } = req.params;
    try {
        const playlist = await playlistModel.findById(playlistId);
        if (!playlist) return next(new ExpressError('Playlist not found', 404));
        if (playlist.private && playlist.userId.toString() !== user.id) return next(new ExpressError('Not Authorized to view this private playlist', 403));
        const movies = [];
        for (let movieId of playlist.movieIds) {
            const movie = await axios('http://www.omdbapi.com/', {
                params: {
                    apikey: process.env.OMDB_API_KEY,
                    i: movieId
                }
            });
            movies.push(movie.data);
        }
        return res.render('playlist', { token, movies, playlistId: playlist._id });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.addToPlaylist = async (req, res, next) => {
    const { user } = req;
    const { playlistId, movieId } = req.body;
    if (!playlistId || !movieId) return next(new ExpressError('Missing parameters', 401));
    try {
        const playlist = await playlistModel.findById(playlistId);
        if (!playlist) return next(new ExpressError('Invalid Playlist ID', 400));
        if (playlist.userId.toString() !== user.id) return next(new ExpressError('Unauthorized Action!', 403));
        if (playlist.movieIds.indexOf(movieId) === -1) {
            await playlistModel.findByIdAndUpdate(playlistId, {
                $push: {
                    movieIds: movieId
                }
            });
        }
        return res.redirect('back');
    } catch(err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.removeFromPlaylist = async (req, res, next) => {
    const { user } = req;
    const { playlistId, movieId } = req.body;
    if (!playlistId || !movieId) return next(new ExpressError('Missing parameters', 401));
    try {
        const playlist = await playlistModel.findById(playlistId);
        if (!playlist) return next(new ExpressError('Invalid Playlist ID', 400));
        if (playlist.userId.toString() !== user.id) return next(new ExpressError('Unauthorized Action!', 403));
        if (playlist.movieIds.indexOf(movieId) === -1) return next(new ExpressError('Movie not found in playlist', 401));
            await playlistModel.findByIdAndUpdate(playlistId, {
                $pull: {
                    movieIds: movieId
                }
            });
        return res.redirect('back');
    } catch(err) {
        console.log(err);
        return next(new ExpressError());
    }
}