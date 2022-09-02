const express = require('express');
const mongoose = require('mongoose');
// const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }))
// middleware
app.use(express.static('public'));
// app.use(express.json());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/jwtnetninja';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)