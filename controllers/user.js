const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const ExpressError = require('../utils/ExpressError');

module.exports.renderAuth = async function (req, res, next) {
    const { action } = req.query;
    if (action === 'login' || action === 'register') return res.render('auth', { action });
    return next(new ExpressError('Bad Request', 400));
}

const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !password || !email) return next(new ExpressError('Parameters Missing', 400));
    try {
        const user = new userModel({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const newUser = await user.save();
        req.session.userID = newUser._id;
        return res.redirect('/home')
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

const login = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !password) return next(new ExpressError('Parameters Missing', 400));
    try {
        const user = await userModel.findOne({ username, email })
        if (!user) return next(new ExpressError('User not found', 401));
        const validPass = await bcrypt.compare(password, user.password);
        if (validPass) {
            req.session.userID = user._id
            return res.redirect('/home');
        } else return next(new ExpressError('Invalid Password', 401));
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.handleAuth = async (req, res, next) => {
    const { action } = req.query;
    if (action === 'login') await login(req, res, next);
    else if (action === 'register') await register(req, res, next);
    else return next(new Error('Bad Request', 400));
}

module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
}