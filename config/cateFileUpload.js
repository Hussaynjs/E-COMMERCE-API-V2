const cloudinary = require('cloudinary').v2
const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg'],
    params: {
        folder: 'payment with stripe'
    }
})


const categoryFileUpload= multer({
    storage
})


module.exports = categoryFileUpload