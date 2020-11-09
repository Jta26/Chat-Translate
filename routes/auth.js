const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/login', (req, res) => {
    res.render('login')
});


router.post('/register_login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(400).json({ error: err })
        }
        if (!user) {
            return res.status(400).json({ error: 'No User Found' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(400).json({ error: err});
            }
            return res.status(200).json({ success: "Successfully logged in user " + user.id});
        })
    })(req, res, next);
});


module.exports = router;