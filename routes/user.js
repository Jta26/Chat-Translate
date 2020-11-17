const express = require('express');
const router = express.Router();
const {requiresAuth} = require('../services/auth');

// sends the data of the currently signed in user.
router.get('/data', requiresAuth, (req, res) => {
    let user = req.user;
    user = user.toObject();
    delete user.password;
    delete user.email_verified;
    res.json(user);
});


module.exports = router;