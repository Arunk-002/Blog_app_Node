const jwt = require('jsonwebtoken')
const key = 'bs0w8%@'


function createToken(id) {
    return jwt.sign(id,key,{expiresIn:'24hr'})
}

function verifyToken(token) {
    return jwt.verify(token,key)
}
module.exports={
    createToken,
    verifyToken
}