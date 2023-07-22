const { StatusCodes } = require("http-status-codes");
const Color = require("../model/Color");
const customError = require('../errors')

  
const createColor = async(req, res) => {
    const {name} = req.body;
    if(!name){
        throw new customError.BadRequestError('please provide name of color')
    }

    const isNameTaken = await Color.findOne({name})

    if(isNameTaken){
        throw new customError.BadRequestError('name of color already taken')
    }

    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.user.userId
    })

    res.status(StatusCodes.CREATED).json({
        data: color
    })

}

const getAllcolors = async(req, res) => {
    const colors= await Color.find({})

    res.status(StatusCodes.OK).json({
        data: colors
    })

}

const getSingleColor = async(req, res) => {
    const color = await Color.findById(req.params.id)
    if(!brand){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }


    res.status(StatusCodes.OK).json({
        data: color
    })

}


const updateColor = async(req, res) => {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
    if(!color){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }


    res.status(StatusCodes.OK).json({
        data: color
    })
}


const deleteColor = async(req, res) => {
     const color = await Color.findByIdAndDelete(req.params.id)
    if(!color){
        throw new customError.NotFoundError(`no category with id: ${req.params.id}`)
    }



    res.status(StatusCodes.OK).json({
        message: 'category deleted'
    })

}


module.exports = {
    createColor,
    getAllcolors,
    getSingleColor,
    updateColor,
    deleteColor
}