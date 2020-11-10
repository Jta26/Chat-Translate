const express = require('express');
const router = express.Router();
const {requiresAuth} = require('../services/auth');


router.get('/', requiresAuth, (req, res) => {
    res.send('Congratz, you\'re logged in.');
});




module.exports = router;