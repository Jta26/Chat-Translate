// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();
const express = require("express");
const app = express();
const router = express.Router();
const auth = require('./routes/auth');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('./services/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const database = require('./services/database');
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connection = database.connect();

app.use(passport.initialize());
app.use(passport.session());


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}))




app.use('/auth', auth);


app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});
