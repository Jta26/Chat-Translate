const express = require('express');
const router = express.Router();
const {requiresAuth} = require('../services/auth');


router.get('/', requiresAuth, (req, res) => {
    const user = req.user;
    console.log(user);
    res.render('dashboard', {user});
});




module.exports = router;