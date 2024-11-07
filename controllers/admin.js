const { status } = require('express/lib/response')
const User = require('../models/user')

async function adminPage(req,res) {
    try {
        if (req.user.role==='admin') {
            let users = await User.find({})
            return res.render('admin',{users})
        }else{
            return res.redirect('/')
        }
    } catch (error) {
        res.render('404')
    }
}

async function userActive(req,res) {
    try {
        const id = req.params.id.replace(/^:/, '')
        await User.findByIdAndUpdate(id,{status:'active'})
        .then(()=>{
            res.redirect('/admin')
        })
    } catch (error) {
        res.render('404')
    }
}

async function userBlock(req,res) {
    try {
        const id = req.params.id.replace(/^:/, '')
        await User.findByIdAndUpdate(id,{status:'suspended'})
        .then(()=>{
            res.redirect('/admin')
        })
    } catch (error) {
        res.render('404')
    }
}

module.exports={
    adminPage,
    userActive,
    userBlock
}