
const User = require('../models/user')
const {createToken} = require('../service/auth')


// Render Pages
function homeroute(req, res) {
    const user =req.user
    res.render('home',{blog:user.id});
}

function usersignupRender(req,res) {
    res.render('signup',{userExists:false})
}
function usersLoginRender(req,res) {
    res.render('login')
}

function adminPage(req,res) {
    if (req.user.role=='admin') {
        return res.render('admin',{data:req.user.role})
    }else{
        return res.redirect('/')
    }
}
//Request Handling 
async function userCreation(req,res) {
    try {
        const newUser = req.body
        let userCheck=User.findOne({email:newUser.email})
        if (userCheck) {
            res.render('signup',{userExists:true})
        }
        if (newUser) {
            const newUser= await User.create({
                name:newUser.name,
                email:newUser.email,
                password:newUser.password
            })
            const token = createToken({
                id:newUser.id,
                role:newUser.role
            })
            res.cookie('idToken',token)
            res.redirect('/')
        }
    } catch (error) {
        
    }    
}

async function Login(req,res) {
    try {
        const userData=req.body
        const cur_user = await User.findOne({
            email:userData.email
        })
        if(cur_user.password==userData.password){
            const token = createToken({
                id:cur_user.id,
                role:cur_user.role
            })//Token created            
            res.cookie('idToken',token)
            if (cur_user.role=="admin"){
                res.status(201).redirect('/admin')
            }else{
                res.redirect('/')
            }
        }else{
            throw new Error("Invalid Password");
        }
    } catch (error) {
        if (error=="Invalid Password") {
            res.status(401).json({msg:error})
        }else{
            res.status(401).json({msg:error})
        }
    }
    
}

module.exports = { 
    homeroute,
    usersignupRender,
    userCreation,
    Login,
    usersLoginRender,
    adminPage
 };
