
const User = require('../models/user')
const {displayBlogs,userBlogFinder} = require('./blog')
const {createToken} = require('../service/auth')


// Render Pages
async function homeroute(req, res) {
    let admin = req.user.role === "admin";
    let id = req.user.id
    let curUser = await User.findById(id)
    console.log(curUser);
    let blogs = await displayBlogs();    
    res.render('home', { blogs, admin,userName:curUser.name});
}


function usersignupRender(req,res) {
    res.render('signup',{userExists:false})
}
function usersLoginRender(req,res) {
    res.render('login',{msg:false})
}

//Request Handling 
async function userCreation(req,res) {
    try {
        const userData = req.body;
        let userCheck = await User.findOne({ email: userData.email });
        if (userCheck) {
            return res.render('signup', { userExists: true });
        }
        const newUser = await User.create({
            name: userData.name,
            email: userData.email,
            password: userData.password
        });
        const token = createToken({
            id: newUser.id,
            role: newUser.role
        });
        res.cookie('idToken', token);
        res.redirect('/');
    } catch (error) {
        console.error(error); 
        res.status(500).send('Internal Server Error');
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
            return res.render('login', { msg: 'Invalid password' });
        }else{
            return res.render('login', { msg: 'No user found with that email address.' });
        }
    }
    
}

async function userHome(req,res) {
    let userId=req.user.id
    let blogs=await userBlogFinder(userId)    
    if (blogs) {
        res.render('userHome',{blogs})
    }
}

function logoutUser(req,res) {
    res.clearCookie('idToken');
    console.log('Cookie has been removed!');
    res.redirect('/login')
}

module.exports = { 
    homeroute,
    usersignupRender,
    userCreation,
    Login,
    usersLoginRender,
    logoutUser,
    userHome
 };
