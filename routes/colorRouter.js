const express = require('express')
const router = express.Router()
const { auth, authorizePermissions } = require('../middleware/auth')
const {
    createColor,
    getAllcolors,
    getSingleColor,
    updateColor,
    deleteColor
} = require('../controllers/colorController')


router
.route('/')
.post(auth, authorizePermissions('admin'), createColor)

router
.route('/')
.get( getAllcolors)

router
.route('/:id')
.get( getSingleColor)

router
.route('/:id')
.patch( auth, authorizePermissions('admin'), updateColor)


router
.route('/:id')
.delete( auth, authorizePermissions('admin'), deleteColor)

module.exports = router