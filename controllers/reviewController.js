const { StatusCodes } = require("http-status-codes");
const Review = require("../model/Review");
const  CustomAPIError  = require("../errors");
const Product = require("../model/Product");


const createReview = async(req, res) => {
    const {message, rating} = req.body;
    const {productID} = req.params

    const productFound = await Product.findById(productID).populate('reviews')
    
    const hasUserReviewed = productFound?.reviews?.find((r) => {
        return r?.user?.toString() === req?.user?.userId.toString()
    })
    console.log(hasUserReviewed)
   if(hasUserReviewed){
        throw new CustomAPIError.BadRequestError('you have already reviewd this product')
    }
    const review = await Review.create({
        message,
        product: productFound._id,
        rating,
        user: req.user.userId
    })

    productFound.reviews.push(review?._id)

    await productFound.save()

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        msg: 'review created',
    data: review
    })

}



module.exports = {createReview}