const express = require('express')
const router = express.Router()

const {createCategory,
    getAllCategories,
    getSingleCategories,
    updateCategory,
    deleteCategory} = require('../controllers/cateController')
const { auth, authorizePermissions } = require('../middleware/auth')

const categoryFileUpload = require('../config/cateFileUpload')

router
.route('/')
.post(auth, authorizePermissions('admin'), categoryFileUpload.single('file'),createCategory)

router
.route('/')
.get( getAllCategories)

router
.route('/:id')
.get( getSingleCategories)

router
.route('/:id')
.patch( auth, authorizePermissions('admin'), updateCategory)


router
.route('/:id')
.delete( auth, authorizePermissions('admin'), deleteCategory)

module.exports = router