const User = require('../model/User')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');


const getAllUsers = async(req, res) => {
    console.log(req.user);
   const users = await User.find({role: 'user'}).select('-password')
   res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async(req, res) => {
    const user = await User.findOne({_id: req.params.id}).select('-password')
   if(!user){
    throw new customError.NotFoundError( `no user with this id: ${req.params.id}`)
   }

   checkPermissions(req.user, user._id)
   res.status(StatusCodes.OK).json({user})
}

const getUserProfile = async(req, res) => {
   const user = await User.findById(req.user.userId).populate('orders')
    res.status(StatusCodes.OK).json({user})
}

const updateUser = async(req, res) => {
   const updates = Object.keys(req.body)
   const validUpdates = ['name', 'email']

   const isUpdatesAllowed = updates.every((update) => validUpdates.includes(update))

   if(!isUpdatesAllowed){
    throw new customError.BadRequestError('invalid updates')
   }

   const user = await User.findOne({_id:req.user.userId})

   if(!user){
    throw new customError.NotFoundError('no user found')
   }

   updates.forEach((update) => user[update] = req.body[update])

   await user.save()

   const tokenUser = createTokenUser({user})

   attachCookiesToResponse({res, user:tokenUser})

   res.status(StatusCodes.OK).json({user: tokenUser})
}

const updatePassword = async(req, res) => {
   const {oldPassword, newPassword, confirmPassword} = req.body;

   if(!oldPassword || !newPassword || !confirmPassword){
    throw new customError.BadRequestError('please provide all values')
   }

   const user = await User.findOne({_id: req.user.userId})

   if(!user){
    throw new customError.NotFoundError('no user found')
   }

   const isPasswordCorrect = await user.comparePassword(oldPassword)

   if(!isPasswordCorrect){
    throw new customError.BadRequestError('invalid credentials')
   }

   if(newPassword !== confirmPassword){
    throw new customError.BadRequestError('invalid credentials')
   }

   user.password = newPassword

   await user.save()

   const tokenUser = createTokenUser({user})

   res.status(StatusCodes.OK).json({user:tokenUser})
}

const updateShippingAddresctrl =  async(req, res) => {

   const {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        country,
        phone
      } = req.body;
    const user = await User.findById({_id: req.user.userId})

    checkPermissions(req.user, user._id)

    user.shippingAddress.firstName = firstName
    user.shippingAddress.lastName = lastName
    user.shippingAddress.country = country
    user.shippingAddress.city = city
    user.shippingAddress.postalCode = postalCode
    user.shippingAddress.province = province
    user.shippingAddress.address = address
    user.shippingAddress.phone = phone
   user.hasShippingAddress = true


    await user.save()

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'shipping address successfully updated',
      data: user
    })
  };
  

module.exports = {
    getAllUsers,
    getSingleUser,
    getUserProfile,
    updateUser,
    updatePassword,
    updateShippingAddresctrl
}