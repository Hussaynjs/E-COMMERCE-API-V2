const {isValid} = require('../utils')
const jwt = require('jsonwebtoken')
const customError = require('../errors')


const auth = async(req, res, next) => {
    const token =req.signedCookies.token

    if(!token){
        throw new customError.UnauthenticatedError('authentication failed')
    }

    try {
        const payload = isValid({token})
        req.user = payload
        next()
        
    } catch (error) {
        throw new customError.UnauthenticatedError('authentication failed')
    }
}

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
          throw new customError.UnauthorizedError(
            'Unauthorized to access this route'
          );
        }
        next();
      };
}

module.exports ={auth, authorizePermissions}