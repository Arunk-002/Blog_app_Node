const User = require('../models/user')

async function adminPage(req,res) {
    if (req.user.role=='admin') {
        let users = await User.find({})
        return res.render('admin',{users})
    }else{
        return res.redirect('/')
    }
}


async function deleteUser(req,res) {
    const userId = req.params.id.replace(/^:/, '')
    User.findByIdAndDelete(userId)
    .then((err)=>{
        res.redirect('/admin')
    })
}


module.exports={
    adminPage,
    deleteUser
}