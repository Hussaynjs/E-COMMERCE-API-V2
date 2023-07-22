const express = require('express')
const router = express.Router()


const {createReview} = require('../controllers/reviewController')
const { auth, authorizePermissions } = require('../middleware/auth')


router
.route('/:productID')
.post(auth,  createReview)

// router
// .route('/')
// .get( getAllCategories)

// router
// .route('/:id')
// .get( getSingleCategories)

// router
// .route('/:id')
// .patch( auth, authorizePermissions('admin'), updateCategory)


// router
// .route('/:id')
// .delete( auth, authorizePermissions('admin'), deleteCategory)

module.exports = router