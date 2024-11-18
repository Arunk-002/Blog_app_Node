const express = require('express');
const { LoginAuthenticator } = require('../middlewares/auth');
const { blogCreateFormRender, blogDelete, blogUpdateFormRender, addBlog, updateBlog, viewBlog,likeBlog,removeNotification } = require('../controllers/blog');

module.exports = (io) => {
    const router = express.Router();

    // Move the /add routes above any route with /:id to prevent misinterpretation
    router.get('/add', LoginAuthenticator, blogCreateFormRender)
        .post('/add', LoginAuthenticator, (req, res) => addBlog(req, res, io)); // Pass io to addBlog
        
        // Other routes
    router.get('/:id', LoginAuthenticator, viewBlog);
    router.get('/edit/:id', LoginAuthenticator, blogUpdateFormRender)
        .post('/edit/:id', LoginAuthenticator, updateBlog);
    router.get('/del/:id', LoginAuthenticator,(req, res) => blogDelete(req, res, io));
    router.get('/del/notify/:id',LoginAuthenticator,removeNotification)
    router.get('/like/:id', LoginAuthenticator, (req, res) => likeBlog(req, res, io)); // Pass io to likeBlog
    return router;
};
