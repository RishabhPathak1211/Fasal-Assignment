const axios = require('axios');
const userModel = require('../models/user');
const playlistModel = require('../models/playlist');
const ExpressError = require("../utils/ExpressError");

module.exports.getLanging = (req, res, next) => {
    return res.render('landing');
}

module.exports.renderHome = async (req, res, next) => {
    const { userID } = req.session;
    try {
        const userData = await userModel.findById(userID);
        const userPlaylists = await playlistModel.find({ userId: userID });
        return res.render('home', { user: userData, userPlaylists, results: undefined, error: undefined });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.search = async (req, res, next) => {
    const { search } = req.query;
    const { userID } = req.session;
    if (!search) return next(new ExpressError('Invalid Search', 400));
    try {
        const userData = await userModel.findById(userID);
        const userPlaylists = await playlistModel.find({ userId: userID });
        const response = await axios('http://www.omdbapi.com/', {
            params: {
                apikey: process.env.OMDB_API_KEY,
                s: search
            },
            method: 'get',
        });
        return res.render('home', { user: userData, userPlaylists, results: response.data.Search, error: response.data.Error });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}