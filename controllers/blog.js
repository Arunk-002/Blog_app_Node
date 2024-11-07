const blog = require('../models/blog')


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

async function updateBlog(req, res) {
    const blogId = req.params.id.replace(/^:/, '');
    const { title, body } = req.body;
    const trimmedTitle = title?.trim();
    const trimmedBody = body?.trim();
    if (trimmedTitle && trimmedBody) {
        let result = await blog.findByIdAndUpdate(blogId, { title: trimmedTitle, body: trimmedBody });
        if (result && result.id) {
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
        let displayBlog = {
            title:curBlog.title,
            body:curBlog.body,
            id:curBlog.id
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

async function addBlog(req,res) {
    try {
        const authId=req.user.id
        let blogBody = req.body;
        await blog.create({
            authorId:authId,
            title:blogBody.title,
            body:blogBody.body
        }).then((result)=>{
            if(result.id){
                res.redirect('/')
            }
        })
    } catch (error) {
        res.render('404')
    }
}

async function blogDelete(req,res) {
    try {
        const blogId=req.params.id.replace(/^:/, '')
        await blog.findByIdAndUpdate(blogId,{isDeleted:true})
        .then((err)=>{
            console.log('blog deleted');
            res.redirect('/')
        })
    } catch (error) {
        res.render('404')
    }
}


function userBlogFinder(userId) {    
    return  blog.find({authorId:userId})
}

module.exports={
    displayBlogs,
    addBlog,
    blogCreateFormRender,
    blogUpdateFormRender,
    updateBlog,
    viewBlog,
    blogDelete,
    userBlogFinder
}