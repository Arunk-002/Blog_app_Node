const express = require('express');
const {LoginAuthenticator} = require('../middlewares/auth')
const {blogCreateFormRender,blogDelete,blogUpdateFormRender,addBlog,updateBlog,viewBlog}= require('../controllers/blog')

const router = express.Router();

// Move the /add routes above any route with /:id to prevent misinterpretation
router.get('/add', LoginAuthenticator, blogCreateFormRender)
        .post('/add', LoginAuthenticator, addBlog);

// Now, place the dynamic route below
router.get('/:id', LoginAuthenticator, viewBlog);
router.get('/edit/:id', LoginAuthenticator, blogUpdateFormRender)
    .post('/edit/:id', LoginAuthenticator, updateBlog);

router.get('/del/:id',LoginAuthenticator,blogDelete)



module.exports=router