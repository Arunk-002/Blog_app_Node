const User = require('../models/user')

async function adminPage(req,res) {
    if (req.user.role=='admin') {
        let users = await User.find({})
        return res.render('admin',{users})
    }else{
        return res.redirect('/')
    }
}



module.exports={
    adminPage,
}