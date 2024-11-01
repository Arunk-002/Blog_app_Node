const blog = require('../models/blog')


async function blogCreateFormRender(req,res) {    
    res.render('blogForm',{
        type:"create",
        title:null,
        body:null,
        blogId:null,
        msg:false
    })
}

async function blogUpdateFormRender(req,res) {
    const blogId=req.params.id.replace(/^:/, '')
    let curBlog =await blog.findById(blogId)
    if (req.user.id==curBlog.authorId || req.user.role=='admin') {
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
    return blog.find().populate('authorId', 'name')       
    
}

async function viewBlog(req,res) {
    let userId = req.user.id
    const blogId=req.params.id.replace(/^:/, '')
    let curBlog = await blog.findById(blogId)
    let displayBlog = {
        title:curBlog.title,
        body:curBlog.body,
        id:curBlog.id
    }
    if (curBlog.authorId==userId ||req.user.role=='admin') {
        res.render('blogView',{displayBlog,display:true})
    } else {
        res.render('blogView',{displayBlog,display:false})
    }
}

async function addBlog(req,res) {
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
}

async function blogDelete(req,res) {
    const blogId=req.params.id.replace(/^:/, '')
    await blog.findByIdAndDelete(blogId)
    .then((err)=>{
        console.log('blog deleted');
        res.redirect('/')
    })
}


async function userBlogFinder(userId) {
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