//coupon model
const mongoose = require('mongoose')
const customError = require('../errors')
const CouponSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

CouponSchema.virtual('isExpired').get(function(){
  return this.endDate < Date.now()
})

CouponSchema.pre('validate', function(next){
  if(this.endDate < this.startDate){
  throw new customError.BadRequestError('end date cannot be less than start date')
  }
  next()
})

CouponSchema.pre('validate', function(next){
  if(this.startDate < Date.now()){
  throw new customError.BadRequestError('start date must not be less than now')
  }
  next()
})

CouponSchema.virtual('days-left').get(function(){
  const daysLeft = Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24))

  return `${daysLeft} days left for coupon to expire`
})

CouponSchema.pre('validate', function(next){
  if(this.endDate < Date.now()){
  throw new customError.BadRequestError('start date must not be less than now')
  }
  next()
})


CouponSchema.pre('validate', function(next){
  if(this.discount < 0 || this.discount > 100){
    throw new customError.BadRequestError('discount must not be less than 0 or greater than 100')

  }
  next()
})

 

module.exports = mongoose.model("Coupon", CouponSchema);

