const express = require('express')
const router = express.Router()
const {
    createBrands,
    getAllBrands,
    getSingleBrand,
    updateBrand,
    deleteBrand
} = require('../controllers/brandControler')

const {auth, authorizePermissions} = require('../middleware/auth')


router
.route('/')
.post(auth, authorizePermissions('admin'), createBrands)

router
.route('/')
.get( getAllBrands)

router
.route('/:id')
.get( getSingleBrand)

router
.route('/:id')
.patch( auth, authorizePermissions('admin'), updateBrand)


router
.route('/:id')
.delete( auth, authorizePermissions('admin'), deleteBrand)



module.exports = router