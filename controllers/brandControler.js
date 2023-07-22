const { StatusCodes } = require("http-status-codes");
const Brands = require("../model/Brands");
const customError = require('../errors')

  
const createBrands = async(req, res) => {
    const {name} = req.body;
    if(!name){
        throw new customError.BadRequestError('please provide name of brands')
    }

    const isNameTaken = await Brands.findOne({name})

    if(isNameTaken){
        throw new customError.BadRequestError('name of category already taken')
    }

    const brand = await Brands.create({
        name: name.toLowerCase(),
        user: req.user.userId
    })

    res.status(StatusCodes.CREATED).json({
        data: brand
    })

}

const getAllBrands = async(req, res) => {
    const brands= await Brands.find({})

    res.status(StatusCodes.OK).json({
        data: brands
    })

}

const getSingleBrand = async(req, res) => {
    const brand = await Brands.findById(req.params.id)
    if(!brand){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }


    res.status(StatusCodes.OK).json({
        data: brand
    })

}


const updateBrand = async(req, res) => {
    const brand = await Category.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
    if(!brand){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }


    res.status(StatusCodes.OK).json({
        data: brand
    })
}


const deleteBrand = async(req, res) => {
     const brand = await Category.findByIdAndDelete(req.params.id)
    if(!brand){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }



    res.status(StatusCodes.OK).json({
        message: 'category deleted'
    })

}


module.exports = {
    createBrands,
    getAllBrands,
    getSingleBrand,
    updateBrand,
    deleteBrand
}