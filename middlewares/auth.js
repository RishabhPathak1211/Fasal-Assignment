const ExpressError = require('../utils/ExpressError');

const auth = async (req, res, next) => {
    const { userID } = req.session;
    if (userID) return next();
    return next(new ExpressError('No User Authenticated', 403));
}

module.exports = auth;