const { verifyToken } = require('../service/auth');
const UserModal = require('../models/user')

async function LoginAuthenticator(req, res, next) {    
    const userToken = req.cookies?.idToken;
    if (!userToken) {
        return res.redirect('/login'); // Return early if no token
    }

    const User = verifyToken(userToken);
    const id = User.id
    const userStatus = await UserModal.findById(id)

    if (!User) { // Redirect if token verification fails
        return res.redirect('/login'); 
    }
    console.log(userStatus.status);
    
    if( userStatus.status !== 'active'){
        return res.redirect('/login')
    }
    req.user = User; // Attach the user to req for downstream handlers
    next();
}

module.exports = { LoginAuthenticator };
