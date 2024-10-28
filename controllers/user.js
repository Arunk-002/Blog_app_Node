
const User = require('../models/user')

function homeroute(req, res) {
    res.render('home', {
        blog: 'new blog post 1'
    });
}

function usersignup(req,res) {
    res.render('signup')
}
function usersLogin(req,res) {
    res.render('login')
}

async function userhandle(req,res) {
    const newUser = req.body
    console.log(newUser);
    if (newUser) {
        const result= await User.create({
            name:newUser.name,
            email:newUser.email,
            password:newUser.password
        })
        console.log(result);
        res.redirect('/')
    }
    
}

async function Login(req,res) {
    const userData=req.body
    console.log(userData);
    const L_user = await User.findOne({
        email:userData.email
    })
    if(L_user.password==userData.password){
        console.log(L_user.name);
        res.render('home',{
            blog:`welcome ${L_user.name}` 
        })
    }
    
}

module.exports = { 
    homeroute,
    usersignup,
    userhandle,
    Login,
    usersLogin
 };
