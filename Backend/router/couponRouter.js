// routes/CouponRouter.js
const express = require('express');
const { createCoupon, applyCoupon } = require("../controller/couponController");

const router = express.Router();

// Định nghĩa các route cho coupon
router.post('/', createCoupon); // Tạo coupon mới
router.post('/apply', applyCoupon); // Áp dụng coupon

module.exports = router;
