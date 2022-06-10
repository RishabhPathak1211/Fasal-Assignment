require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const ExpressError = require('./utils/ExpressError');
const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);
app.use('/', homeRoutes);

app.use('*', (req, res, next) => {
    next(new ExpressError('Url not found', 404));
});

app.use((err, req, res, next) => {
    const { message = 'Server Error', statusCode = 500 } = err;
    return res.render('error', { message, statusCode });
})


const port = process.env.PORT;
app.listen(port, () => console.log('Listening on port ' + port))