// controllers/CouponController.js
const Coupon = require("../models/Coupon");
const User = require("../models/Users")
// Tạo coupon mới
const createCoupon = async (req, res) => {
  const { code, discount, expiryDate } = req.body;

  const newCoupon = new Coupon({
    code,
    discount,
    expiryDate,
    isActive: true
  });
  try {
    await newCoupon.save();

    await User.updateMany({}, { $push: { CouponList: newCoupon._id } });

    res.status(201).json(newCoupon);
  } catch (error) {
    console.error("Error while creating coupon:", error);
    res.status(400).json({ message: "Có lỗi xảy ra", error });
  }
};

// Lấy danh sách tất cả coupon
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error });
  }
};

// Cập nhật coupon
const updateCoupon = async (req, res) => { 
  const id = req.params.id;
  
  const { code, discount, expiryDate, isActive } = req.body;

  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discount, expiryDate, isActive },
      { new: true } // Trả về đối tượng đã cập nhật
    );

    if (!updatedCoupon) {
      console.log("coupon ko tồn tại");
      
      return res.status(404).json({ message: "Coupon không tồn tại" });
    }
    console.log('Response:', req.data);
    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.log("error", error);

    res.status(400).json({ message: "Có lỗi xảy ra", error });
  }
};

// Xóa coupon
const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon không tồn tại" });
    }

    res.status(200).json({ message: "Coupon đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error });
  }
};

// Áp dụng coupon
const applyCoupon = async (req, res) => {
  const { code, totalAmount } = req.body;

  try {
    const coupon = await Coupon.findOne({ code, isActive: true });

    // Kiểm tra nếu coupon không có hoặc đã hết hạn
    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Mã coupon không hợp lệ hoặc đã hết hạn." });
    }

    const currentDate = new Date();
    if (currentDate > coupon.expiryDate) {
      return res.status(400).json({ message: "Coupon đã hết hạn." });
    }

    const discountAmount = (totalAmount * coupon.discount) / 100; // Tính giá trị giảm giá
    const finalAmount = totalAmount - discountAmount;

    res.status(200).json({
      discount: coupon.discount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
