const { StatusCodes } = require("http-status-codes");
const Coupon = require("../model/Coupon");
const customError = require('../errors')

const createCouponCode = async(req, res) => {
   const {code, discount, startDate, endDate} = req.body;

   const isCodeAlreadyExist = await Coupon.findOne({code})

   if(isCodeAlreadyExist){
    throw new customError.BadRequestError('coupon code already exist')
   }

   if(isNaN(discount)){
    throw new customError.BadRequestError('discount must be a number')
   }

   const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    discount,
    startDate,
    endDate,
    user: req.user.userId
   })

   res.status(StatusCodes.CREATED).json({
    status: 'success',
    msg: 'coupon added succefully',
    data: coupon
   })
}


const getAllCoupons = async(req, res) => {
   const coupons = await Coupon.find()
   res.status(StatusCodes.OK).json({
      status: 'success',
      msg: 'coupons fetched   succefully',
      data: coupons
     })
}

const getSingleCoupon = async(req, res) => {
   const id = req.params.id

   const coupon = await Coupon.findById(id)

   if(!coupon){
      throw new customError.NotFoundError(`no coupon with id`)
   }

   res.status(StatusCodes.OK).json({
      status: 'success',
      msg: 'coupons fetched   succefully',
      data: coupon
     })
}

const updateCoupon = async(req, res) => {
   const id = req.params.id

   const coupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})

   if(!coupon){
      throw new customError.NotFoundError(`no coupon with id`)
   }

   res.status(StatusCodes.OK).json({
      status: 'success',
      msg: 'coupon updated succefully',
      data: coupon
     })

}

const deleteCoupon = async(req, res) => {
   const id = req.params.id

   const coupon = await Coupon.findByIdAndDelete(id)

   if(!coupon){
      throw new customError.NotFoundError(`no coupon with id`)
   }

   res.status(StatusCodes.OK).json({
      status: 'success',
      msg: 'coupon deleted succefully',
     })

}


module.exports = {createCouponCode, getAllCoupons, getSingleCoupon, updateCoupon, deleteCoupon}