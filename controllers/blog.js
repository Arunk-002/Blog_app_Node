const blog = require('../models/blog')


async function blogCreateFormRender(req,res) {    
    res.render('blogForm',{
        type:"create",
        title:null,
        body:null,
        blogId:null
    })

}

async function blogUpdateFormRender(req,res) {
    const blogId=req.params.id.replace(/^:/, '')
        let curBlog =await blog.findById(blogId)
        res.render('blogForm',{
            type:"Update",
            title:curBlog.title,
            body:curBlog.body,
            blogId:blogId
        })

}

async function updateBlog(req,res) {
    const blogId=req.params.id.replace(/^:/, '')
    const content =  req.body
    let result = await blog.findByIdAndUpdate(blogId,content)
    if(result.id){
        res.redirect('/')
    }
}

function displayBlogs() {
    return blog.find({})       
    
}

async function viewBlog(req,res) {
    const blogId=req.params.id.replace(/^:/, '')
    let curBlog = await blog.findById(blogId)
    res.render('blogView',{curBlog})
}

async function addBlog(req,res) {
    const authId=req.params.id.replace(/^:/, '')
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
        console.log('blog delted');
        res.redirect('/')
    })
}

module.exports={
    displayBlogs,
    addBlog,
    blogCreateFormRender,
    blogUpdateFormRender,
    updateBlog,
    viewBlog,
    blogDelete
}