const { verifyToken } = require('../service/auth');

function LoginAuthenticator(req, res, next) {    
    const userToken = req.cookies?.idToken;
    if (!userToken) {
        return res.redirect('/login'); // Return early if no token
    }

    const User = verifyToken(userToken);
    if (!User) {
        return res.redirect('/login'); // Redirect if token verification fails
    }

    req.user = User; // Attach the user to req for downstream handlers
    next();
}

module.exports = { LoginAuthenticator };
