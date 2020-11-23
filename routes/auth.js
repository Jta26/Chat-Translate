const express = require('express');
const router = express.Router();
const passport = require('passport');

const {forwardOnAuth} = require('../services/auth');


router.get('/login', forwardOnAuth, (req, res) => {
    res.render('login');
});

router.get('/signup', forwardOnAuth, (req, res) => {
    res.render('signup')
})

router.post('/register_login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(400).json({ error: err })
        }
        if (!user) {
            return res.status(404).json({ error: 'No User Found' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(400).json({ error: err});
            }
            return res.status(200).redirect('/chat/');
        })
    })(req, res, next);
});


module.exports = router;