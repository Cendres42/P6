const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/auth');

//création deux routes POST
router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);

module.exports= router;
