// routes/user.js
const express = require('express');
const { homeroute,userhandle,usersignup, Login,usersLogin } = require('../controllers/user'); // Corrected import path
const router = express.Router();

router.get('/', homeroute);
router.get('/signup',usersignup)
router.post('/signup',userhandle)
router.get('/login',usersLogin)
router.post('/login',Login)


module.exports = router; // Export the router directly
