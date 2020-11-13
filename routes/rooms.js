
const express = require('express');
const router = express.Router();
const {requiresAuth} = require('../services/auth');

router.get('/test', requiresAuth, (req, res) => {
    res.render('sockets_test');
})




module.exports = router;