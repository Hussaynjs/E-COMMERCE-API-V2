const express = require('express')
const router = express.Router()
const {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateProductCtrl,
    deleteProductCtrl
} = require('../controllers/productController')
const upload = require('../config/fileUpload')
const {auth, authorizePermissions}= require('../middleware/auth')

router
.route('/')
.post(auth,authorizePermissions('admin'),upload.array('files'),createProduct)

router
.route('/')
.get(getAllProducts)


router
.route('/:id')
.get(getSingleProduct)

router
.route('/:id')
.patch(auth,authorizePermissions('admin'),updateProductCtrl)

router
.route('/:id')
.delete(auth,authorizePermissions('admin'),deleteProductCtrl)

module.exports = router