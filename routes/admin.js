const express = require('express');
const {LoginAuthenticator} = require('../middlewares/auth')
const {adminPage} = require('../controllers/admin')
const router = express.Router();

router.get('/',LoginAuthenticator,adminPage)


module.exports=router