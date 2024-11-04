const express = require('express');
const {LoginAuthenticator} = require('../middlewares/auth')
const {adminPage,userActive,userBlock} = require('../controllers/admin')
const router = express.Router();

router.get('/',LoginAuthenticator,adminPage),
router.get('/useractive/:id',LoginAuthenticator,userActive),
router.get('/userblock/:id',LoginAuthenticator,userBlock),


module.exports=router