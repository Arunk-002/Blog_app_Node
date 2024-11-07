
const User = require('../models/user')
const {displayBlogs,userBlogFinder} = require('./blog')
const {createToken} = require('../service/auth')


// Render Pages
async function homeroute(req, res) {
    try {
        let admin = req.user.role === "admin";
        let id = req.user.id
        let curUser = await User.findById(id)
        let blogs = await displayBlogs();
        blogs.forEach(blog => {
            blog.isAuthor = blog.authorId.id.toString() === curUser.id.toString();
          });              
        res.render('home', { blogs, admin,userName:curUser.name});
    } catch (error) {
        console.log(error);
        res.render('404')
    }
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
            email: userData.email.toLowerCase(),
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
        res.status(500).render('404');
    }
      
}

async function Login(req,res) {
    try {
        const userData=req.body
        const cur_user = await User.findOne({
            email:userData.email
        })
        if(cur_user.password===userData.password.toLowerCase() && cur_user.status==='active'){
            const token = createToken({
                id:cur_user.id,
                role:cur_user.role
            })//Token created            
            res.cookie('idToken',token)
            if (cur_user.role==="admin"){
                res.status(201).redirect('/admin')
            }else{
                res.redirect('/')
            }
        }else{
            if (!cur_user.status==='active') {
                throw new Error("Account is currently"+cur_user.status);
                
            } else {
                throw new Error("Invalid Password");
            }
        }
    }catch (err) {
        if (err.message === "Invalid Password") {
            return res.render('login', { msg: 'Invalid password' });
        } else if (err.message === "Account is currently suspended") {
            return res.render('login', { msg: err.message });
        } else {
            return res.render('login', { msg: 'No user found with that email address' });
        }
    }
    
    
}

async function userHome(req,res) {
    try {
        let userId=req.user.id
        let blogs=await userBlogFinder(userId)    
        if (blogs) {
            res.render('userHome',{blogs})
        }
    } catch (error) {
        console.log(error);
        res.render('404')
    }
}

function logoutUser(req,res) {
    try {
        res.clearCookie('idToken');
        console.log('Cookie has been removed!');
        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
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
