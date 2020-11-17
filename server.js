// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();
const express = require("express");
const app = express();
const http = require('http').createServer(app);
const router = express.Router();

const auth = require('./routes/auth');
const chat = require('./routes/chat');

const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {passport} = require('./services/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const database = require('./services/database');

//translation
const translator = require('./services/translation');

// app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connection = database.connect();


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', auth);
app.use('/chat', chat);

app.get("/", (req, res) => {
  res.render('index');
});

// listen for requests :)
const listener = http.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});
