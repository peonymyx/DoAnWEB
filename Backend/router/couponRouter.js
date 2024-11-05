// routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
    getCouponById
} = require('../controller/couponController');

// Tạo coupon mới
router.post('/', createCoupon);

// Lấy danh sách tất cả coupon
router.get('/', getAllCoupons);
router.get("/:id", getCouponById);
// Cập nhật coupon theo ID
router.put('/:id', updateCoupon);

// Xóa coupon theo ID
router.delete('/:id', deleteCoupon);

// Áp dụng coupon
router.post('/apply', applyCoupon);

module.exports = router;
