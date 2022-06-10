const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: () => 'Not a valid Email Address'
        }
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);