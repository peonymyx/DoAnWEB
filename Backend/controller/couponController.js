// controllers/CouponController.js
const Coupon = require('../models/Coupon');

// Tạo coupon mới
const createCoupon = async (req, res) => {
    const { code, discount, expiryDate } = req.body;

    const newCoupon = new Coupon({ code, discount, expiryDate });
    try {
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(400).json({ message: 'Có lỗi xảy ra', error });
    }
};

// Áp dụng coupon
const applyCoupon = async (req, res) => {
    const { code, totalAmount } = req.body;

    try {
        const coupon = await Coupon.findOne({ code, isActive: true });

        // Kiểm tra nếu coupon không có hoặc đã hết hạn
        if (!coupon) {
            return res.status(404).json({ message: 'Mã coupon không hợp lệ hoặc đã hết hạn.' });
        }

        const currentDate = new Date();
        if (currentDate > coupon.expiryDate) {
            return res.status(400).json({ message: 'Coupon đã hết hạn.' });
        }

        const discountAmount = (totalAmount * coupon.discount) / 100; // Tính giá trị giảm giá
        const finalAmount = totalAmount - discountAmount;

        res.status(200).json({
            discount: coupon.discount,
            finalAmount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
};

module.exports = {
    createCoupon,
    applyCoupon,
};
