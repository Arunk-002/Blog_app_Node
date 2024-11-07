const express = require('express');
const {LoginAuthenticator} = require('../middlewares/auth')
const { homeroute,userCreation,
        usersignupRender,Login,
        usersLoginRender,
        logoutUser,
        userHome
         } = require('../controllers/user'); 

const router = express.Router();

//home
router.get('/',LoginAuthenticator, homeroute);

//signup and login
router.get('/signup',usersignupRender)
      .post('/signup',userCreation)
      
router.get('/user',LoginAuthenticator,userHome)

router.get('/login',usersLoginRender)
       .post('/login',Login)

router.get('/logout',logoutUser);
  

module.exports = router; // Export the router directly
