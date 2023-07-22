const User = require('../model/User')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors');
const { attachCookiesToResponse } = require('../utils');
const createTokenUser = require('../utils/createTokenUser');


const register = async(req, res) => {
   const {email, name, password} = req.body;

   if(!email || !name || !password){
  throw new customError.BadRequestError('please provide all values')
   }

   const isEmailAlreadyExist = await User.findOne({email})

   if(isEmailAlreadyExist){
    throw new customError.BadRequestError('email already exist')
   }

   const isFirstAccount = await User.countDocuments({}) === 0;

   const role = isFirstAccount ? 'admin' : 'user'

   const user = await User.create({
    name,
    email,
    password,
    role
   })

   if(user.role === 'admin'){
    user.isAdmin = true
    await user.save()
   }
   const tokenUser = createTokenUser(user)
   attachCookiesToResponse({res, user:tokenUser})

   res.status(StatusCodes.CREATED).json({
    msg: 'success',
    data: user
   })


}

const login = async(req, res) => {
   const {email, password} = req.body;
   if(!email  || !password){
    throw new customError.BadRequestError('please provide email and password')
     }

     const user = await User.findOne({email})

     if(!user){
        throw new customError.NotFoundError('invalid credentials')
     }

     const isPasswordCorrect = await user.confirmPassword(password)

     if(!isPasswordCorrect){
        throw new customError.NotFoundError('invalid credentials')
     }

     if(user.role === 'admin'){
        user.isAdmin =true
        await user.save()
     }

  
 const tokenUser = createTokenUser(user)
   attachCookiesToResponse({res, user:tokenUser})

   res.status(StatusCodes.CREATED).json({
    msg: 'success',
    data: user
   })


}

const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.status(StatusCodes.OK).json({messg: 'logout successful'})
}

module.exports = {
    register,
    login,
    logout
}