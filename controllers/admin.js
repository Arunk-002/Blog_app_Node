const User = require('../models/user')

async function adminPage(req,res) {
    if (req.user.role=='admin') {
        let users = await User.find({})
        return res.render('admin',{users})
    }else{
        return res.redirect('/')
    }
}

async function userActive(req,res) {
    const id = req.params.id.replace(/^:/, '')
    await User.findByIdAndUpdate(id,{active:true})
    .then(()=>{
        res.redirect('/admin')
    })
}

async function userBlock(req,res) {
    const id = req.params.id.replace(/^:/, '')
    await User.findByIdAndUpdate(id,{active:false})
    .then(()=>{
        res.redirect('/admin')
    })
}

module.exports={
    adminPage,
    userActive,
    userBlock
}