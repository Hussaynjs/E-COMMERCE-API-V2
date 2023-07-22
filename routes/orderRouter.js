const { createOrder, getAllOrders, getSingleOrder, updateOrder,getOrderStatsCtrl } = require("../controllers/orderController");
const express = require('express')
const router = express.Router()
const { auth, authorizePermissions } = require('../middleware/auth')


router
.route('/')
.post(auth, createOrder)


router
.route('/')
.get(auth,authorizePermissions('admin'), getAllOrders)

router.get("/sales/stats", auth,authorizePermissions('admin'), getOrderStatsCtrl);


router
.route('/:id')
.get(auth,authorizePermissions('admin'), getSingleOrder)


router
.route('/:id')
.patch(auth,authorizePermissions('admin'), updateOrder)

module.exports = router