const express = require('express');
const router = express.Router();
const {requiresAuth} = require('../services/auth');
const {updateUserLanguage} = require('../services/user');

// sends the data of the currently signed in user.
router.get('/data', requiresAuth, (req, res) => {
    let user = req.user;
    user = user.toObject();
    delete user.password;
    delete user.email_verified;
    res.json(user);
});

router.get('/logout', requiresAuth, (req, res) => {
    req.logout();
    res.redirect('/');
})

// change language preferences
router.put('/updateLang', requiresAuth, (req, res) => {
    let user = req.user;
    let language = req.body.language;
    updateUserLanguage(user, language).then((update) => {
        if (update) {
            res.status(200).send();
        }
        else {
            res.status(401).send()
        }
    });
})

module.exports = router;