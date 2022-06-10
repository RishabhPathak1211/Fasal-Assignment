const jwt = require("jsonwebtoken");
const axios = require('axios');
const userModel = require('../models/user');
const ExpressError = require("../utils/ExpressError");

module.exports.getLanging = (req, res, next) => {
    return res.render('landing');
}

module.exports.renderHome = async (req, res, next) => {
    const { user } = req;
    const { token } = req.query;
    try {
        const userData = await userModel.findById(user.id);
        return res.render('home', { user: userData, token, results: undefined, error: undefined });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.search = async (req, res, next) => {
    const { search, token } = req.query;
    const { user } = req
    if (!search) return next(new ExpressError('Invalid Search', 400));
    try {
        const userData = await userModel.findById(user.id);
        const response = await axios('http://www.omdbapi.com/', {
            params: {
                apikey: process.env.OMDB_API_KEY,
                s: search
            },
            method: 'get',
        });
        return res.render('home', { token, user: userData, results: response.data.Search, error: response.data.Error });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}