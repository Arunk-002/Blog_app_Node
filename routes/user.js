const express = require('express');
const {LoginAuthenticator} = require('../middlewares/auth')
const { homeroute,userCreation,
        usersignupRender,Login,
        usersLoginRender,adminPage
         } = require('../controllers/user'); 

const router = express.Router();

//home
router.get('/',LoginAuthenticator, homeroute);

//signup and login
router.get('/signup',usersignupRender)
router.get('/login',usersLoginRender)
router.post('/signup',userCreation)
router.post('/login',Login)

//admin
router.get('/admin',LoginAuthenticator,adminPage)


module.exports = router; // Export the router directly
