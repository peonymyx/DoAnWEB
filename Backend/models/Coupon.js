const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date, // Ngày hết hạn
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true, // Đánh dấu coupon còn hiệu lực
    },
})

const DiscountCode = mongoose.model('DiscountCode', CouponSchema);
module.exports = DiscountCode;