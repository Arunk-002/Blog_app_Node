const express = require('express');
const {LoginAuthenticator} = require('../middlewares/auth')
const {adminPage,deleteUser} = require('../controllers/admin')
const router = express.Router();

router.get('/',LoginAuthenticator,adminPage)


router.get('/delUser/:id', LoginAuthenticator, deleteUser);


module.exports=router