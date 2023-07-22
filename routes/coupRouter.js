const express = require('express')
const router = express.Router()
const  {createCouponCode,  getAllCoupons, getSingleCoupon, updateCoupon, deleteCoupon} = require('../controllers/couponController')
const { authorizePermissions, auth } = require('../middleware/auth')

router
.route('/')
.post(auth,authorizePermissions('admin'), createCouponCode)


router
.route('/')
.get(auth, getAllCoupons)


router
.route('/:id')
.get(auth, getSingleCoupon)


router
.route('/:id')
.patch(auth,authorizePermissions('admin'), updateCoupon)


router
.route('/:id')
.delete(auth,authorizePermissions('admin'), deleteCoupon)


module.exports = router