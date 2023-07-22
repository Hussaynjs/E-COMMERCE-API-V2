const Category = require('../model/Category')
const customError = require('../errors')
const {StatusCodes} = require('http-status-codes')


const createCategory = async(req, res) => {
    const {name} = req.body;
    if(!name){
        throw new customError.BadRequestError('please provide name of category')
    }

    const isNameTaken = await Category.findOne({name})

    if(isNameTaken){
        throw new customError.BadRequestError('name of category already taken')
    }

    const uploadedImage = req.file.path;

    const category = await Category.create({
        name: name?.toLowerCase(),
        user: req.user.userId,
        image: uploadedImage
    })

    res.status(StatusCodes.CREATED).json({
        data: category
    })

}

const getAllCategories = async(req, res) => {
    const categories = await Category.find({})

    res.status(StatusCodes.OK).json({
        data: categories
    })

}

const getSingleCategories = async(req, res) => {
    const category = await Category.findById(req.params.id)
    if(!category){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }


    res.status(StatusCodes.OK).json({
        data: category
    })

}


const updateCategory = async(req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
    if(!category){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }


    res.status(StatusCodes.OK).json({
        data: category
    })
}


const deleteCategory = async(req, res) => {
     const category = await Category.findByIdAndDelete(req.params.id)
    if(!category){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }



    res.status(StatusCodes.OK).json({
        message: 'category deleted'
    })

}

module.exports = {
    createCategory,
    getAllCategories,
    getSingleCategories,
    updateCategory,
    deleteCategory
}