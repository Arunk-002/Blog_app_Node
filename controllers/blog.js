const blog = require('../models/blog')
const User=require('../models/user')
const Notification = require('../models/notifications')

async function blogCreateFormRender(req,res) { 
    try {
        res.render('blogForm',{
            type:"create",
            title:null,
            body:null,
            blogId:null,
            msg:false
        })
    } catch (error) {
        res.render('404')
    }   
}

async function blogUpdateFormRender(req,res) {
    try {
        const blogId=req.params.id.replace(/^:/, '')
        let curBlog =await blog.findById(blogId)
        if (req.user.id?.toString()===curBlog.authorId?.toString() || req.user.role==='admin') {
            res.render('blogForm',{
                type:"Update",
                title:curBlog.title,
                body:curBlog.body,
                blogId:blogId,
                msg:false
            })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('404')
    }

}

async function updateBlog(req, res,io) {
    const blogId = req.params.id.replace(/^:/, '');
    const { title, body } = req.body;
    const trimmedTitle = title?.trim();
    const trimmedBody = body?.trim();
    const userId = req.user.id;
    try {
        const checkBlog = await blog.findById(blogId);
        if (checkBlog && checkBlog.authorId.toString() === userId.toString()) {
            if (trimmedTitle && trimmedBody) {
                let result = await blog.findByIdAndUpdate(blogId, { title: trimmedTitle, body: trimmedBody });
                if (result && result.id) {
                    const author = await User.findById(result.authorId)
                    console.log(author);
                    io.emit('updateBlog', {
                        id: result.id,
                        title: trimmedTitle,
                        body: trimmedBody,
                        authorName: author.name,
                        likes:result.likes.length
                    });
                    return res.redirect('/');
                }
            }
            res.render('blogForm', {
                type: "Update",
                title: trimmedTitle,
                body: trimmedBody,
                blogId: blogId,
                msg: 'Enter full details',
            });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.render('404');
    }
}



function displayBlogs() {
    return blog.find({isDeleted:false}).populate('authorId', 'name')       
    
}

async function viewBlog(req,res) {
    try {
        let userId = req.user.id
        const blogId=req.params.id.replace(/^:/, '')
        let curBlog = await blog.findById(blogId)
        if (!curBlog.id) {
            throw new Error("blog not found");
        }
        let displayBlog
        const hasLiked = await curBlog.likes.includes(userId)
        if (hasLiked) {
            displayBlog = {
                title:curBlog.title,
                body:curBlog.body,
                id:curBlog.id,
                liked:true,
                likeCount: curBlog.likes.length
            }
        } else {
            displayBlog = {
                title:curBlog.title,
                body:curBlog.body,
                id:curBlog.id,
                liked:false,
                likeCount: curBlog.likes.length
            }
        }
        if (curBlog.authorId?.toString()===userId?.toString() ||req.user.role=='admin') {
            res.render('blogView',{displayBlog,display:true})
        } else {
            res.render('blogView',{displayBlog,display:false})
        }
    } catch (error) {
        res.render('404')
    }
}

async function addBlog(req,res,io) {
    try {
        const authId=req.user.id
        let blogBody = req.body;
        let author = await User.findById(authId).select('name');
        await blog.create({
            authorId:authId,
            title:blogBody.title,
            body:blogBody.body
        }).then((result)=>{
            if(result.id){
                io.emit('newPost', {
                    id: result.id,
                    title: result.title,
                    body: result.body,
                    authorName: author,
                    likes:result.likes.length
                });
                res.redirect('/') 
            }
        })
    } catch (error) {
        res.render('404')
    }
}

async function blogDelete(req, res,io) {
    try {
        const blogId = req.params.id.replace(/^:/, '');
        const userId = req.user.id;
        let checkBlog = await blog.findById(blogId);
        if (checkBlog && checkBlog.authorId.toString() === userId.toString()) {
            await blog.findByIdAndUpdate(blogId, { isDeleted: true });
            io.emit('deleted',{
                id:blogId,
                delete:true
            })
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.render('404');
    }
}


function userBlogFinder(userId) {    
    return  blog.find({authorId:userId,isDeleted:false})
}

async function likeBlog(req,res,io) {
    const blogId= req.params.id.replace(/^:/, '');
    const userId=req.user.id
    try {
        const blogPost = await blog.findById(blogId)
        const hasLiked = await blogPost.likes.includes(userId)
        const userName = await User.findById(userId).select('name')
        if (!hasLiked) {
            blogPost.likes.push(userId);
            await blogPost.save();
            const notification = await Notification.create({
                userId:blogPost.authorId
            })
            io.emit('likeNotification', {
                authorId: blogPost.authorId,
                user: userName,
                title:blogPost.title,
                blogid: blogPost.id,
                msgId:notification.id
            });
            return res.status(200).json({ liked:true });
        } else {
            blogPost.likes.pull(userId)
            await blogPost.save();
            io.emit('unliked',{
                unliked:true,
                blogid:blogPost.id
            })
            return res.status(200).json({ liked:false });
        }
    } catch (error) {
        console.log(error);
        res.render('404')
    }
}

async function removeNotification(req,res) {
    const id = req.params.id.replace(/^:/, '');
    Notification.findByIdAndDelete(id).then((res)=>{
        if (res) {
            console.log('deleted');
        }
    })
    res.redirect('/')
}

module.exports={
    displayBlogs,
    addBlog,
    blogCreateFormRender,
    blogUpdateFormRender,
    updateBlog,
    viewBlog,
    blogDelete,
    userBlogFinder,
    likeBlog,
    removeNotification
}