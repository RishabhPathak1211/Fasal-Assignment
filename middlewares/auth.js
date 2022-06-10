const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');

const auth = async (req, res, next) => {
    const { token } = req.query;
    if (!token) return next(new ExpressError('Token Missing', 403));
    try {
        const tokenSecret = process.env.TOKEN_SECRET;
        const decoded = jwt.verify(token, tokenSecret);
        if (!decoded) return next(new ExpressError('Invalid Token', 403));
        req.user = decoded;
        return next();
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports = auth;