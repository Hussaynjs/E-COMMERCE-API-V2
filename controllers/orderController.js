const { StatusCodes } = require("http-status-codes");
const Order = require("../model/Order");
const Stripe = require('stripe')
const customError = require('../errors');
const Product = require("../model/Product");
const User = require("../model/User");
const Coupon = require("../model/Coupon");


const stripe = new Stripe(process.env.STRIPE_API_KEY)

const createOrder = async(req, res) => {
    const {coupon} = req.query

    const couponFound = await Coupon.findOne({code: coupon?.toUpperCase()})

    if(!couponFound){
        throw new customError.NotFoundError('coupon does not exist')
    }

    if(couponFound.isExpired){
        throw new customError.BadRequestError('coupon is expired')
    }

    const discount = couponFound?.discount / 100
    const {orderItems, shippingAddress, totalPrice} = req.body;

    if(orderItems.length <= 0){
        throw new customError.BadRequestError('no items available')
    }


    const user = await User.findById({_id: req.user.userId})

    if(!user.hasShippingAddress){
        throw new customError.BadRequestError('please update your shipping address')
    }


    const order = await Order.create({
        orderItems,
        shippingAddress: user?.shippingAddress,
        user: user?._id,
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice
    })
    //console.log(order);
    
    const products = await Product.find({_id: {$in:orderItems}})

    orderItems?.map(async(order) => {
        const product =  products?.find((product) => {
            return order?._id.toString() === product?._id.toString()
        })
  
        if(product){
            product.totalSold += order.totalQtyBuying
        }
        await product.save()

    })

    await user.orders.push(order?._id)
    await user.save()

    const userOrder = orderItems.map((item) => {
        return {
            price_data:{
                currency: 'usd',
                product_data: {
                    name: item?.name,
                    description: item?.description
                },
                unit_amount: item?.price * 100
            },
            quantity: item?.totalQty
        }
    })

    const sessions = await stripe.checkout.sessions.create({
        metadata:{
            orderId: JSON.stringify(order?._id)
        },
        line_items: userOrder,
        mode: 'payment',
        success_url: 'http://localhost:5000/pay',
        cancel_url: 'http://localhost:5000/cancel'
    })
 res.json({
    url: sessions.url
 })
//     res.status(StatusCodes.CREATED).json({
//         status: "success",
//         message: "order created",
//     user,
// order   
 //})
 

    
   
}


const getAllOrders = async(req, res) => {
    const id = req.params.id
    const orders = await Order.find()

    res.status(StatusCodes.OK).json({nmbHits: orders.length, orders})
}

const getSingleOrder = async(req, res) => {
    const id = req.params.id
   
   
    const order = await Order.findById(id)

    // if(order){
    //     throw new customError.NotFoundError({msg: `no order with id: ${id}`})
    // }


    res.status(StatusCodes.OK).json({order})
}

const updateOrder = async(req, res) => {
    const id = req.params.id
   
   
    const order = await Order.findByIdAndUpdate(id, {
        status: req.body.status
    },{
        new: true,
        runValidators: true
    })


    res.status(StatusCodes.OK).json({order})
}

 const getOrderStatsCtrl = async (req, res) => {
    //get order stats
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          minimumSale: {
            $min: "$totalPrice",
          },
          totalSales: {
            $sum: "$totalPrice",
          },
          maxSale: {
            $max: "$totalPrice",
          },
          avgSale: {
            $avg: "$totalPrice",
          },
        },
      },
    ]);
    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const saleToday = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);
    //send response
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Sum of orders",
      orders,
      saleToday,
    });
  };
  

module.exports = {createOrder, getAllOrders, getSingleOrder, updateOrder, getOrderStatsCtrl}