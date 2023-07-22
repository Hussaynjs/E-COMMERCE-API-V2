const Product = require("../model/Product");
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors');
const Category = require("../model/Category");
const Brands = require("../model/Brands");
const Color = require("../model/Color");



const createProduct = async(req, res) => {
   
    const convertedImages = req.files.map((file) => {
        return file.path
    })

    const {name, brand, description, category,  sizes, colors, price,  totalQty, totalSold} = req.body
    const product = await Product.create({
        name,
        brand,
        description,
        category,
        sizes,
        colors,
        price,
        totalQty,
        totalSold,
        images: convertedImages,
        user: req.user.userId
    })

    // const productFound = await Product.findOne({name})

    // if(productFound){
    //     throw new customError.BadRequestError('product already exist')
    // }

    const colorFound = await Color.findOne({ colors})

    if(!colorFound){
        throw new customError.NotFoundError('please provide a a legit color name')
    }


    const brandFound = await Brands.findOne({name: brand})

    if(!brandFound){
        throw new customError.NotFoundError('please provide a a legit brand name')
    }

    brandFound.products.push(product._id)

   

    const cateFound = await Category.findOne({name: category})

    if(!cateFound){
        throw new customError.NotFoundError('please provide a category')
    }

    cateFound.products.push(product._id)



    res.status(StatusCodes.CREATED).json({
        msg: 'success',
        data: product
    })

    await brandFound.save()
    await cateFound.save()
console.log(req.user);
}

const getAllProducts = async(req, res) => {

    let productQuery = Product.find()

    if(req.query.name){
        productQuery = productQuery.find({
            name: {$regex: req.query.name, $options: 'i'}
        })
    }

    if(req.query.brand){
        productQuery = productQuery.find({
            brand: {$regex: req.query.brand, $options: 'i'}
        })
    }
    if(req.query.size){
        productQuery = productQuery.find({
            sizes: {$regex: req.query.size, $options: 'i'}
        })
    }

    if(req.query.category){
        productQuery = productQuery.find({
            category: {$regex: req.query.category, $options: 'i'}
        })
    }

    if(req.query.colors){
        productQuery = productQuery.find({
            colors: {$regex: req.query.colors, $options: 'i'}
        })
    }

    if(req.query.price){
      const priceRange = req.query.price.split('-')
      productQuery = productQuery.find({
        price : {$gte: priceRange[0], $lte: priceRange[1]}
      })
    }

    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  
    const products = await productQuery.populate('reviews')
   res.status(StatusCodes.OK).json({
    nmbHits: products.length,
    status: 'success',
    data: products,
    pagination,
    message: "Products fetched successfully",
    total
   })
    
}


const getSingleProduct = async(req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews')

    if(!product){
        throw new customError.NotFoundError(`no product by id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({
        data: product
    })
}

const updateProductCtrl = async(req, res) => {

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    })

    if(!product){
        throw new customError.NotFoundError(`no product by id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({
        data: product
    })
}


const deleteProductCtrl = async(req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if(!product){
        throw new customError.NotFoundError(`no product by id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Product deleted successfully",
      });

}
module.exports = {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateProductCtrl,
    deleteProductCtrl
}
